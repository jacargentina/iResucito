//@flow
import SongsIndex from './songs/index.json';

export const limpiarNotasRegex = /\[|\]|#|\*|5|6|7|9|b|-|\+|\/|\u2013|\u2217|aum|dim/g;

export const notas = [
  'Do',
  'Do#',
  'Re',
  'Mib',
  'Mi',
  'Fa',
  'Fa#',
  'Sol',
  'Sol#',
  'La',
  'Sib',
  'Si'
];

export const notaInicial = (linea: string): string => {
  var pedazos = linea.split(' ');
  var primero = pedazos[0];
  return primero.replace(limpiarNotasRegex, '');
};

export const calcularTransporte = (
  primerLineaNotas: string,
  notaDestino: string
): number => {
  var notaOrigen = notaInicial(primerLineaNotas);
  var inicio = notas.indexOf(notaOrigen);
  var destino = notas.indexOf(notaDestino);
  return destino - inicio;
};

const notasInverted = notas.slice().reverse();

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

export class SongsProcessor {
  basePath: string;
  songsLister: PathLoaderFunc;
  songReader: PathLoaderFunc;
  songStyles: SongStyles;

  constructor(
    basePath: string,
    songsLister: PathLoaderFunc,
    songReader: PathLoaderFunc,
    songStyles: SongStyles
  ) {
    this.basePath = basePath;
    this.songsLister = songsLister;
    this.songReader = songReader;
    this.songStyles = songStyles;
  }

  getSongFileFromFilename(filename: string): SongFile {
    var titulo = filename.includes(' - ')
      ? filename.substring(0, filename.indexOf(' - ')).trim()
      : filename;
    var fuente =
      titulo !== filename
        ? filename.substring(filename.indexOf(' - ') + 3).trim()
        : '';
    var nombre = filename.replace('.txt', '');
    return {
      nombre: nombre,
      titulo: titulo,
      fuente: fuente
    };
  }

  assignInfoFromFile(info: Song, files: any, locale: string) {
    var parsed = this.getSongFileFromFilename(files[locale]);
    info.nombre = parsed.nombre;
    info.titulo = parsed.titulo;
    info.fuente = parsed.fuente;
    info.path = `${this.basePath}/${locale}/${parsed.nombre}.txt`;
  }

  getSingleSongMeta(key: string, locale: string, patch: any): Song {
    if (!SongsIndex.hasOwnProperty(key))
      throw new Error(`There is no key = ${key} on the Index!`);
    var info: Song = Object.assign({}, SongsIndex[key]);
    info.key = key;
    if (!info.files.hasOwnProperty(locale)) {
      const defaultLocale = Object.getOwnPropertyNames(info.files)[0];
      this.assignInfoFromFile(info, info.files, defaultLocale);
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
    return this.songsLister(`${this.basePath}/${locale}`)
      .then(items => {
        // Very important to call "normalize"
        // See editing.txt for details
        items = items
          .map(i => i.name)
          .filter(i => i.endsWith('.txt'))
          .map(i => i.replace('.txt', '').normalize())
          .map(i => this.getSongFileFromFilename(i));
        items.sort(ordenAlfabetico);
        return items;
      })
      .catch(() => {
        // No existe el locale suministrado
        return [];
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
        song.lines = [];
        song.fullText = '';
      });
  }

  loadSongs(songs: Array<Song>): Array<Promise<any>> {
    return songs.map(song => {
      return this.loadSingleSong(song);
    });
  }

  /* eslint-disable no-unused-vars */
  preprocesarLinea(text: string): SongLine {
    if (text.startsWith('S. A.')) {
      // Indicador de Salmista Y Asamblea
      var secondPoint = 4;
      var it: SongLine = {
        texto: text.substring(secondPoint + 1).trim(),
        style: this.songStyles.lineaNormal,
        prefijo: text.substring(0, secondPoint + 1) + ' ',
        prefijoStyle: this.songStyles.prefijo,
        sufijo: '',
        sufijoStyle: null,
        canto: false,
        cantoConIndicador: true,
        notas: false,
        inicioParrafo: false,
        notaEspecial: false,
        tituloEspecial: false,
        textoEspecial: false
      };
      return it;
    } else if (
      text.startsWith('S.') ||
      text.startsWith('C.') ||
      text.startsWith('D.') ||
      text.startsWith('U.') ||
      text.startsWith('H.') ||
      text.startsWith('M.') ||
      text.startsWith('A.') ||
      text.startsWith('P.') ||
      text.startsWith('Niños.') ||
      text.startsWith('N.')
    ) {
      // Indicador de Salmista, Asamblea, Presbitero, Hombres, Mujeres, etc
      var pointIndex = text.indexOf('.');
      var it: SongLine = {
        texto: text.substring(pointIndex + 1).trim(),
        style: this.songStyles.lineaNormal,
        prefijo: text.substring(0, pointIndex + 1) + ' ',
        prefijoStyle: this.songStyles.prefijo,
        sufijo: '',
        sufijoStyle: null,
        canto: false,
        cantoConIndicador: true,
        notas: false,
        inicioParrafo: false,
        notaEspecial: false,
        tituloEspecial: false,
        textoEspecial: false
      };
      // Si tiene indicador de Nota?
      if (it.texto.endsWith('\u2217')) {
        it.texto = it.texto.replace('\u2217', '');
        it.sufijo = '\u2217';
        it.sufijoStyle = this.songStyles.lineaNotas;
      }
      return it;
    } else if (esLineaDeNotas(text)) {
      var it: SongLine = {
        texto: text.trimRight(),
        style: this.songStyles.lineaNotas,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        canto: false,
        cantoConIndicador: true,
        notas: true,
        inicioParrafo: false,
        notaEspecial: false,
        tituloEspecial: false,
        textoEspecial: false
      };
      return it;
    } else if (text.startsWith('\u2217')) {
      // Nota especial
      var it: SongLine = {
        texto: text.substring(1).trim(),
        style: this.songStyles.lineaNotaEspecial,
        prefijo: '\u2217  ',
        prefijoStyle: this.songStyles.lineaNotas,
        sufijo: '',
        sufijoStyle: null,
        canto: false,
        cantoConIndicador: true,
        notas: false,
        inicioParrafo: false,
        notaEspecial: true,
        tituloEspecial: false,
        textoEspecial: false
      };
      return it;
    } else if (text.trim().startsWith('**') && text.trim().endsWith('**')) {
      // Titulo especial
      var it: SongLine = {
        canto: false,
        texto: text.replace(/\*/g, '').trim(),
        style: this.songStyles.lineaTituloNotaEspecial,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        canto: false,
        cantoConIndicador: true,
        notas: false,
        inicioParrafo: true,
        notaEspecial: false,
        tituloEspecial: true,
        textoEspecial: false
      };
      return it;
    } else if (text.startsWith('-')) {
      // Texto especial
      var it: SongLine = {
        canto: false,
        texto: text.replace('-', '').trim(),
        style: this.songStyles.lineaNotaEspecial,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        canto: false,
        cantoConIndicador: true,
        notas: false,
        inicioParrafo: false,
        notaEspecial: false,
        tituloEspecial: false,
        textoEspecial: true
      };
      return it;
    } else {
      var texto = text.trimRight();
      var it: SongLine = {
        texto: texto,
        style: this.songStyles.lineaNormal,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        canto: texto !== '',
        cantoConIndicador: texto !== '',
        notas: false,
        inicioParrafo: false,
        notaEspecial: false,
        tituloEspecial: false,
        textoEspecial: false
      };
      return it;
    }
  }

  transportarNotas(lineaNotas: string, diferencia: number): string {
    var pedazos = lineaNotas.split(' ');
    var result = pedazos.map(item => {
      var notaLimpia = item.replace(limpiarNotasRegex, '');
      var notaIndex = notas.indexOf(notaLimpia);
      if (notaIndex !== -1) {
        var notaNuevoIndex = (notaIndex + diferencia) % 12;
        var transporte =
          notaNuevoIndex < 0
            ? notasInverted[notaNuevoIndex * -1]
            : notas[notaNuevoIndex];
        if (notaLimpia.length !== item.length)
          transporte += item.substring(notaLimpia.length);
        return transporte;
      }
      return item;
    });
    return result.join(' ');
  }

  preprocesarCanto(
    lines: Array<string>,
    diferenciaTransporte: number
  ): Array<SongLine> {
    var firstPass = lines.map(l => {
      var it = this.preprocesarLinea(l);
      if (it.notas && diferenciaTransporte !== 0) {
        it.texto = this.transportarNotas(it.texto, diferenciaTransporte);
      }
      return it;
    });
    return firstPass.map((it, i) => {
      // Ajustar margen izquierdo por prefijos
      if (it.prefijo == '' && i > 0) {
        var prevIt = firstPass[i - 1];
        if (prevIt.prefijo !== '') {
          it.prefijo = ' '.repeat(prevIt.prefijo.length);
        }
      } else if (it.prefijo == '' && i < firstPass.length - 1) {
        var nextIt = firstPass[i + 1];
        if (nextIt.prefijo !== '') {
          it.prefijo = ' '.repeat(nextIt.prefijo.length);
        }
      }
      // Ajustar estilo para las notas
      if (it.texto.trim() == '' && i < firstPass.length - 1) {
        var nextItm = firstPass[i + 1];
        if (nextItm.canto) {
          it.style = this.songStyles.lineaNotas;
          it.notas = true;
        }
      }
      // Ajustar estilo para las notas si es la primer linea
      if (it.notas && i < firstPass.length - 1) {
        var nextItmn = firstPass[i + 1];
        if (nextItmn.prefijo !== '') {
          it.style = this.songStyles.lineaNotasConMargen;
          it.inicioParrafo = true;
        }
      }
      // Ajustar inicios de parrafo (lineas vacias)
      if (it.texto === '' && i < firstPass.length - 1) {
        var nextItmnn = firstPass[i + 1];
        if (nextItmnn.notas || nextItmnn.texto !== '') {
          it.inicioParrafo = true;
        }
      }
      return it;
    });
  }
}
