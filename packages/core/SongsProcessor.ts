import {
  getPropertyLocale,
  Song,
  SongChange,
  SongFile,
  SongIndexPatch,
  SongPatchData,
  SongRef,
  SongsChanges,
  SongsData,
  SongSettingsFile,
  CollaboratorsData,
} from './common';
import SongsIndexRaw from './songs.json';
import SongsHistoryRaw from './patches.json';
import CollaboratorsRaw from './collaborators.json';

export const SongsHistory: SongsChanges = SongsHistoryRaw;

export const SongsIndex: SongsData = SongsIndexRaw;

export const CollaboratorsIndex: CollaboratorsData = CollaboratorsRaw;

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

  getBestFileForLocale(
    files: { [key: string]: string },
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

  getSongHistory(key: string, rawLoc: string): Array<SongChange> {
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
    if (!SongsIndex.hasOwnProperty(key)) {
      throw Error(`No existe ${key} en el índice`);
    }
    const song = SongsIndex[key];

    const bestFile = this.getBestFileForLocale(song.files, rawLoc, key);

    const parsed = getSongFileFromString(bestFile.name);

    var info = {
      key,
      patched: false,
      rating: 0,
      transportTo: '',
      notTranslated: false,
      advent: !!song.advent,
      christmas: !!song.christmas,
      lent: !!song.lent,
      easter: !!song.easter,
      pentecost: !!song.pentecost,
      'signing to the virgin': !!song['signing to the virgin'],
      "children's songs": !!song["children's songs"],
      'lutes and vespers': !!song['lutes and vespers'],
      entrance: !!song.entrance,
      'peace and offerings': !!song['peace and offerings'],
      'fraction of bread': !!song['fraction of bread'],
      communion: !!song.communion,
      exit: !!song.exit,
      files: song.files,
      stages: song.stages,
      stage: song.stage,
      nombre: parsed.nombre,
      fuente: parsed.fuente,
      titulo: parsed.titulo,
      path: `${this.basePath}/${bestFile.locale}/${bestFile.name}.txt`,
      // Asignar numero de version segun historico
      version: this.getSongHistory(key, rawLoc).length,
      fullText: '',
    };

    // Aplicar stage segun idioma, si esta disponible
    if (info.stages) {
      const stageLoc = getPropertyLocale(info.stages, rawLoc);
      if (stageLoc) {
        info.stage = info.stages[stageLoc];
      }
    }
    // Si se aplico un parche
    // Asignar los valores del mismo
    if (patch && patch.hasOwnProperty(key)) {
      var loc = getPropertyLocale(patch[key], rawLoc);
      if (loc) {
        info.patched = true;
        const { name, stage } = patch[key][loc];
        const renamed = getSongFileFromString(name);
        info.nombre = renamed.nombre;
        info.fuente = renamed.fuente;
        info.titulo = renamed.titulo;
        if (stage) {
          info.stages = { ...info.stages, [loc]: stage };
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
    settings?: SongSettingsFile
  ): Array<Song> {
    var songs = Object.keys(SongsIndex).map((key) => {
      return this.getSingleSongMeta(key, rawLoc, patch, settings);
    });
    if (patch) {
      // Cantos agregados
      // claves numericas presentes en el
      // patch y ausentes en el indice
      const agregados = Object.keys(patch).filter(
        (pKey) => songs.find((s) => s.key === pKey) === undefined
      );
      agregados.forEach((pKey) => {
        var sPatch = patch[pKey];
        if (sPatch[rawLoc]) {
          var patchData: SongPatchData = sPatch[rawLoc];
          const parsed = getSongFileFromString(patchData.name);
          var info = {
            key: pKey,
            patched: false,
            rating: 0,
            transportTo: '',
            notTranslated: false,
            added: true,
            advent: false,
            christmas: false,
            lent: false,
            easter: false,
            pentecost: false,
            'signing to the virgin': false,
            "children's songs": false,
            'lutes and vespers': false,
            entrance: false,
            'peace and offerings': false,
            'fraction of bread': false,
            communion: false,
            exit: false,
            version: 0,
            nombre: parsed.nombre,
            titulo: parsed.titulo,
            fuente: parsed.fuente,
            files: {
              [rawLoc]: patchData.name,
            },
            stage: patchData.stage,
            path: `${this.basePath}/${rawLoc}/${patchData.name}.txt`,
            fullText: '',
          };
          songs.push(info);
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
      let files = items
        .map((i) => i.name)
        .filter((i) => i.endsWith('.txt'))
        .map((i) => i.replace('.txt', '').normalize())
        .map((i) => getSongFileFromString(i));
      files.sort(ordenAlfabetico);
      return files;
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
    patch?: SongIndexPatch
  ): Promise<any> {
    try {
      if (patch && patch.hasOwnProperty(song.key)) {
        const sPatch = patch[song.key];
        var loc = getPropertyLocale(sPatch, rawLoc);
        if (loc && sPatch[loc].lines) {
          song.fullText = sPatch[loc].lines as string;
          return;
        }
      }
      var content = await this.songReader(song.path);
      if (typeof content === 'string') {
        song.fullText = content;
      }
    } catch (err) {
      console.log(
        `loadSingleSong key=${song.key}, locale=${rawLoc}, error=${err.message}`
      );
      song.error = err.message;
      song.fullText = '';
    }
  }

  async loadSongs(
    rawLoc: string,
    songs: Array<Song>,
    patch?: SongIndexPatch
  ): Promise<any> {
    return Promise.all(
      songs.map((song) => {
        return this.loadSingleSong(rawLoc, song, patch);
      })
    );
  }
}
