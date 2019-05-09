//@flow
import { textToLines } from './common';
import SongsIndex from '../songs/index.json';
import I18n from './translations';

export const getSongFileFromString = (str: string): SongFile => {
  var titulo = str.includes(' - ')
    ? str.substring(0, str.indexOf(' - ')).trim()
    : str;
  var fuente =
    titulo !== str ? str.substring(str.indexOf(' - ') + 3).trim() : '';
  var nombre = str.replace('.txt', '');
  return {
    nombre: nombre,
    titulo: titulo,
    fuente: fuente
  };
};

export function ordenAlfabetico(a: SongRef, b: SongRef) {
  return a.titulo.localeCompare(b.titulo);
}

declare type PathLoaderFunc = (path: string) => Promise<any>;

export class SongsProcessor {
  basePath: string;
  songsLister: PathLoaderFunc;
  songReader: PathLoaderFunc;

  constructor(
    basePath: string,
    songsLister: PathLoaderFunc,
    songReader: PathLoaderFunc
  ) {
    this.basePath = basePath;
    this.songsLister = songsLister;
    this.songReader = songReader;
  }

  assignInfoFromFile(info: Song, parsed: SongFile) {
    info.nombre = parsed.nombre;
    info.titulo = parsed.titulo;
    info.fuente = parsed.fuente;
  }

  getSingleSongMeta(
    key: string,
    rawLoc: string,
    patch: ?SongIndexPatch,
    ratings: ?SongRatingFile
  ): Song {
    if (!SongsIndex.hasOwnProperty(key))
      throw new Error(`There is no key = ${key} on the Index!`);
    const files = SongsIndex[key].files;
    var loc = null;
    // If specific locale file is found...
    if (files.hasOwnProperty(rawLoc)) {
      loc = rawLoc;
    } else {
      // Else remove country code...
      const locale = rawLoc.split('-')[0];
      if (files.hasOwnProperty(locale)) {
        loc = locale;
      } else {
        loc = Object.getOwnPropertyNames(files)[0];
      }
    }
    var info: Song = Object.assign({}, SongsIndex[key]);
    info.key = key;
    info.path = `${this.basePath}/${loc}/${info.files[loc]}.txt`;
    const parsed = getSongFileFromString(info.files[loc]);
    this.assignInfoFromFile(info, parsed);
    // Si se aplico un parche
    // Asignar los valores del mismo
    if (
      patch &&
      patch.hasOwnProperty(key) &&
      patch[key].hasOwnProperty(rawLoc)
    ) {
      info.patched = true;
      info.patchedTitle = info.titulo;
      const { file, rename } = patch[key][rawLoc];
      if (file) {
        info.path = `${this.basePath}/${rawLoc}/${file}.txt`;
        info.files = Object.assign({}, info.files, {
          [rawLoc]: file
        });
        const parsed = getSongFileFromString(file);
        this.assignInfoFromFile(info, parsed);
      }
      if (rename) {
        const renamed = getSongFileFromString(rename);
        info.nombre = renamed.nombre;
        info.titulo = renamed.titulo;
        info.fuente = renamed.fuente;
      }
    }
    // Si se aplico un rating
    // Aplicar los valores
    if (
      ratings &&
      ratings.hasOwnProperty(key) &&
      ratings[key].hasOwnProperty(rawLoc)
    ) {
      info.rating = ratings[key][rawLoc];
    }
    return info;
  }

  getSongsMeta(
    rawLoc: string,
    patch: ?SongIndexPatch,
    ratings: ?SongRatingFile
  ): Array<Song> {
    var songs = Object.keys(SongsIndex).map(key => {
      return this.getSingleSongMeta(key, rawLoc, patch, ratings);
    });
    songs.sort(ordenAlfabetico);
    return songs;
  }

  readLocaleSongs(rawLoc: string): Promise<Array<SongFile>> {
    return this.songsLister(`${this.basePath}/${rawLoc}`)
      .then(items => {
        // Very important to call "normalize"
        // See editing.txt for details
        items = items
          .map(i => i.name)
          .filter(i => i.endsWith('.txt'))
          .map(i => i.replace('.txt', '').normalize())
          .map(i => getSongFileFromString(i));
        items.sort(ordenAlfabetico);
        return items;
      })
      .catch(err => {
        console.log('readLocaleSongs ERROR', err);
        return [];
      });
  }

  loadLocaleSongFile(rawLoc: string, file: SongFile): Promise<string> {
    const path = `${this.basePath}/${rawLoc}/${file.nombre}.txt`;
    return this.songReader(path);
  }

  loadSingleSong(song: Song, patch: ?SongIndexPatch): Promise<any> {
    return Promise.resolve()
      .then(() => {
        if (
          patch &&
          patch.hasOwnProperty(song.key) &&
          patch[song.key].hasOwnProperty(I18n.locale) &&
          patch[song.key][I18n.locale].hasOwnProperty('lines')
        ) {
          return patch[song.key][I18n.locale].lines;
        }
        return this.songReader(song.path);
      })
      .then(content => {
        if (typeof content == 'string') {
          song.lines = textToLines(content);
          song.fullText = song.lines.join(' ');
        }
      })
      .catch(err => {
        console.log('loadSingleSong ERROR', song.key, err.message);
        song.error = err.message;
        song.lines = [];
        song.fullText = '';
      });
  }

  loadSongs(songs: Array<Song>, patch: ?SongIndexPatch): Array<Promise<any>> {
    return songs.map(song => {
      return this.loadSingleSong(song, patch);
    });
  }
}
