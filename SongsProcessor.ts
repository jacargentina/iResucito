import { getPropertyLocale } from './common';
import SongsIndex from './songs/index.json';
import SongsHistory from './songs/patches.json';

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
    fuente: fuente,
  };
};

export function ordenAlfabetico(a: SongRef, b: SongRef): number {
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

  getBestFileForLocale(
    files: { [string]: string },
    rawLoc: string,
    defaultFile: string
  ): { locale: string; name: string } {
    var loc = getPropertyLocale(files, rawLoc);
    if (!loc) {
      loc = Object.getOwnPropertyNames(files)[0];
    }
    if (!loc) {
      loc = rawLoc;
    }
    var file = files[loc];
    if (!file) {
      file = defaultFile;
    }
    return { locale: loc, name: file };
  }

  getSongHistory(key: string, rawLoc: string): Array<SongPatchData> {
    const history = SongsHistory[key];
    if (history) {
      return history.filter((p) => p.locale === rawLoc);
    }
    return [];
  }

  getSingleSongMeta(
    key: string,
    rawLoc: string,
    patch: SongIndexPatch | undefined,
    settings: SongSettingsFile | undefined
  ): Song {
    var info: Song = SongsIndex.hasOwnProperty(key)
      ? Object.assign({}, SongsIndex[key])
      : {};
    info.key = key;
    info.files = SongsIndex.hasOwnProperty(key) ? SongsIndex[key].files : {};
    const bestFile = this.getBestFileForLocale(info.files, rawLoc, info.nombre);
    info.path = `${this.basePath}/${bestFile.locale}/${bestFile.name}.txt`;
    if (bestFile.name) {
      const parsed = getSongFileFromString(bestFile.name);
      this.assignInfoFromFile(info, parsed);
    }
    // Asignar numero de version segun historico
    info.version = this.getSongHistory(key, rawLoc).length;
    // Aplicar stage segun idioma, si esta disponible
    if (info.stages) {
      const stageLoc = getPropertyLocale(info.stages, rawLoc);
      if (info.stages && stageLoc) {
        info.stage = info.stages[stageLoc];
      }
    }
    // Si se aplico un parche
    // Asignar los valores del mismo
    if (patch && patch.hasOwnProperty(key)) {
      var loc = getPropertyLocale(patch[key], rawLoc);
      if (loc) {
        info.patched = true;
        info.patchedTitle = info.titulo;
        const { name, stage } = patch[key][loc];
        const renamed = getSongFileFromString(name);
        this.assignInfoFromFile(info, renamed);
        if (stage) {
          info.stages = Object.assign({}, info.stages, {
            [loc]: stage,
          });
          info.stage = stage;
        }
      }
    }
    // Si se aplicó un rating y/o transporte
    // aplicar los valores
    if (settings && settings.hasOwnProperty(key)) {
      var loc = getPropertyLocale(settings[key], rawLoc);
      if (loc) {
        info.rating = settings[key][loc].rating;
        info.transportTo = settings[key][loc].transportTo;
      }
    }
    info.notTranslated =
      !info.patched && !getPropertyLocale(info.files, rawLoc);
    return info;
  }

  getSongsMeta(
    rawLoc: string,
    patch: SongIndexPatch | undefined,
    settings: SongSettingsFile | undefined
  ): Array<Song> {
    var songs = Object.keys(SongsIndex).map((key) => {
      return this.getSingleSongMeta(key, rawLoc, patch, settings);
    });
    if (patch) {
      // Cantos agregados
      // claves numericas presentes en el
      // patch y ausentes en el indice
      Object.keys(patch).forEach((pKey) => {
        if (!songs.find((s) => s.key === pKey)) {
          var sPatch = patch[pKey];
          if (sPatch[rawLoc]) {
            var info: Song = {};
            info.key = pKey;
            info.added = true;
            var patchData: SongPatchData = sPatch[rawLoc];
            var files: { [string]: string } = {};
            var stages: { [string]: string } = {};
            files[rawLoc] = patchData.name;
            if (patchData.stage) {
              const stage = patchData.stage;
              stages[rawLoc] = stage;
              info.stage = stage;
            }
            info.files = files;
            info.stages = stages;
            const bestFile = this.getBestFileForLocale(
              files,
              rawLoc,
              patchData.name
            );
            const parsed = getSongFileFromString(bestFile.name);
            this.assignInfoFromFile(info, parsed);
            songs.push(info);
          }
        }
      });
    }
    songs.sort(ordenAlfabetico);
    return songs;
  }

  async readLocaleSongs(rawLoc: string): Promise<Array<SongFile>> {
    try {
      let items = await this.songsLister(`${this.basePath}/${rawLoc}`);
      // Very important to call "normalize"
      // See editing.txt for details
      items = items
        .map((i) => i.name)
        .filter((i_1) => i_1.endsWith('.txt'))
        .map((i_2) => i_2.replace('.txt', '').normalize())
        .map((i_3) => getSongFileFromString(i_3));
      items.sort(ordenAlfabetico);
      return items;
    } catch (err) {
      console.log('readLocaleSongs ERROR', err);
      return [];
    }
  }

  async loadLocaleSongFile(rawLoc: string, filename: string): Promise<string> {
    const path = `${this.basePath}/${rawLoc}/${filename}.txt`;
    return this.songReader(path);
  }

  async loadSingleSong(
    rawLoc: string,
    song: Song,
    patch: SongIndexPatch | undefined
  ): Promise<any> {
    return Promise.resolve()
      .then(() => {
        if (patch && patch.hasOwnProperty(song.key)) {
          const sPatch = patch[song.key];
          var loc = getPropertyLocale(sPatch, rawLoc);
          if (loc && sPatch[loc].hasOwnProperty('lines')) {
            return sPatch[loc].lines;
          }
        }
        return this.songReader(song.path);
      })
      .then((content) => {
        if (typeof content === 'string') {
          song.fullText = content;
        }
      })
      .catch((err) => {
        console.log(
          `loadSingleSong key=${song.key}, locale=${rawLoc}, error=${err.message}`
        );
        song.error = err.message;
        song.fullText = '';
      });
  }

  async loadSongs(
    rawLoc: string,
    songs: Array<Song>,
    patch: SongIndexPatch | undefined
  ): Promise<any> {
    return Promise.all(
      songs.map((song) => {
        return this.loadSingleSong(rawLoc, song, patch);
      })
    );
  }
}
