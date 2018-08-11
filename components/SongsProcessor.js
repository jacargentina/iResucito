//@flow
import SongsIndex from '../songs';

export const limpiarNotasRegex = /\[|\]|#|\*|5|6|7|9|b|-|\+|\/|\u2013|\u2217|aum|dim/g;

export function esLineaDeNotas(text: string): boolean {
  if (text === undefined) {
    throw 'esLineaDeNotas: no se puede procesar "undefined"';
  }
  var linea = text
    .trim()
    .replace(limpiarNotasRegex, '')
    .split(' ')
    .filter(i => i.length > 0);
  var soloNotas = linea.filter(palabra => {
    return (
      palabra == 'Do' ||
      palabra == 'Re' ||
      palabra == 'Mi' ||
      palabra == 'Fa' ||
      palabra == 'Sol' ||
      palabra == 'La' ||
      palabra == 'Si'
    );
  });
  return soloNotas.length > 0 && soloNotas.length == linea.length;
}

export function ordenAlfabetico(a: SongRef, b: SongRef) {
  if (a.titulo < b.titulo) {
    return -1;
  }
  if (a.titulo > b.titulo) {
    return 1;
  }
  return 0;
}

declare type PathLoaderFunc = (path: string) => Promise<any>;

class SongsProcessor {
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

  getSongFileFromFilename(nombre: string) {
    var titulo = nombre.includes(' - ')
      ? nombre.substring(0, nombre.indexOf(' - ')).trim()
      : nombre;
    var fuente =
      titulo !== nombre
        ? nombre.substring(nombre.indexOf(' - ') + 3).trim()
        : '';
    return (SongFile = {
      nombre: nombre,
      titulo: titulo,
      fuente: fuente
    });
  }

  assignInfoFromFile(info: Song, files: any, locale: string) {
    var parsed = this.getSongFileFromFilename(files[locale]);
    info.nombre = parsed.nombre;
    info.titulo = parsed.titulo;
    info.fuente = parsed.fuente;
    info.path = `${this.basePath}/${locale}/${files[locale]}.txt`;
  }

  getSingleSongMeta(key: string, locale: string, patch: any): Song {
    if (!SongsIndex.hasOwnProperty(key))
      throw new Error(`There is no key = ${key} on the Index!`);
    var info: Song = Object.assign({}, SongsIndex[key]);
    info.key = key;
    if (!info.files.hasOwnProperty(locale)) {
      this.assignInfoFromFile(info, info.files, 'es');
      info.patchable = true;
      if (patch && patch.hasOwnProperty(key)) {
        if (patch[key].hasOwnProperty(locale)) {
          info.patched = true;
          info.patchedTitle = info.titulo;
          this.assignInfoFromFile(info, patch[key], locale);
          info.files = Object.assign({}, info.files, patch[key]);
        }
      }
    } else {
      this.assignInfoFromFile(info, info.files, locale);
    }
    return info;
  }

  getSongsMeta(rawLoc: string, patch: any): Array<Song> {
    var locale = rawLoc.split('-')[0];
    var songs = Object.keys(SongsIndex).map(key => {
      return this.getSingleSongMeta(key, locale, patch);
    });
    songs.sort(ordenAlfabetico);
    return songs;
  }

  readLocaleSongs(rawLoc: string) {
    var locale = rawLoc.split('-')[0];
    return this.songsLister(`${this.basePath}/${locale}`).then(items => {
      // Very important to call "normalize"
      // See editing.txt for details
      items = items
        .map(i => i.name)
        .filter(i => i.endsWith('.txt'))
        .map(i => i.replace('.txt', '').normalize())
        .map(i => this.getSongFileFromFilename(i));
      items.sort(ordenAlfabetico);
      return items;
    });
  }

  loadSingleSong(song: Song): Promise<any> {
    return this.songReader(song.path)
      .then(content => {
        // Separar en lineas, y quitar todas hasta llegar a las notas
        var lineas = content.replace('\r\n', '\n').split('\n');
        while (lineas.length && !esLineaDeNotas(lineas[0])) {
          lineas.shift();
        }
        song.lines = lineas;
        song.fullText = lineas.join(' ');
      })
      .catch(err => {
        song.error = err.message;
      });
  }

  loadSongs(songs: Array<Song>): Array<Promise<any>> {
    return songs.map(song => {
      return this.loadSingleSong(song);
    });
  }
}

export default SongsProcessor;
