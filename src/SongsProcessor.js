//@flow
import { textToLines, getPropertyLocale } from './common';
import SongsIndex from '../songs/index.json';

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

  getBestFileForLocale(files: { [string]: string }, rawLoc: string) {
    var loc = getPropertyLocale(files, rawLoc);
    if (!loc) {
      loc = Object.getOwnPropertyNames(files)[0];
    }
    return { locale: loc, name: files[loc] };
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
    var info: Song = Object.assign({}, SongsIndex[key]);
    info.key = key;
    const bestFile = this.getBestFileForLocale(files, rawLoc);
    info.path = `${this.basePath}/${bestFile.locale}/${bestFile.name}.txt`;
    const parsed = getSongFileFromString(bestFile.name);
    this.assignInfoFromFile(info, parsed);
    // Si se aplico un parche
    // Asignar los valores del mismo
    if (patch && patch.hasOwnProperty(key)) {
      var loc = getPropertyLocale(patch[key], rawLoc);
      if (loc) {
        info.patched = true;
        info.patchedTitle = info.titulo;
        const { file, rename } = patch[key][loc];
        if (file) {
          info.path = `${this.basePath}/${loc}/${file}.txt`;
          info.files = Object.assign({}, info.files, {
            [loc]: file
          });
          const parsed = getSongFileFromString(file);
          this.assignInfoFromFile(info, parsed);
        }
        if (rename) {
          const renamed = getSongFileFromString(rename);
          this.assignInfoFromFile(info, renamed);
        }
      }
    }
    // Si se aplico un rating
    // Aplicar los valores
    if (ratings && ratings.hasOwnProperty(key)) {
      var loc = getPropertyLocale(ratings[key], rawLoc);
      if (loc) {
        info.rating = ratings[key][loc];
      }
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
    if (patch) {
      Object.keys(patch).forEach(pKey => {
        if (!songs.find(s => s.key === pKey) && patch) {
          var sPatch = patch[pKey];
          var files: { [string]: string } = {};
          Object.keys(sPatch).map(locale => {
            var patchData: SongPatchData = sPatch[locale];
            if (patchData.rename) {
              files[locale] = patchData.rename;
            }
          });
          var info: Song = {};
          info.key = pKey;
          info.files = files;
          const bestFile = this.getBestFileForLocale(files, rawLoc);
          const parsed = getSongFileFromString(bestFile.name);
          this.assignInfoFromFile(info, parsed);
          songs.push(info);
        }
      });
    }
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

  loadSingleSong(
    rawLoc: string,
    song: Song,
    patch: ?SongIndexPatch
  ): Promise<any> {
    return Promise.resolve()
      .then(() => {
        if (patch && patch.hasOwnProperty(song.key)) {
          var loc = getPropertyLocale(patch[song.key], rawLoc);
          if (loc && patch[song.key][loc].hasOwnProperty('lines')) {
            return patch[song.key][loc].lines;
          }
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

  loadSongs(
    rawLoc: string,
    songs: Array<Song>,
    patch: ?SongIndexPatch
  ): Array<Promise<any>> {
    return songs.map(song => {
      return this.loadSingleSong(rawLoc, song, patch);
    });
  }
}
