//@flow
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

export const cleanChordsRegex = /\[|\]|#|\*|5|6|7|9|b|-|\+|\/|\u2013|\u2217|aum|dim/g;

export const getChordsScale = (locale: string) => {
  return I18n.t('chords.scale', { locale }).split(' ');
};

export const getInitialChord = (linea: string): string => {
  var pedazos = linea.split(' ');
  var primero = pedazos[0];
  return primero.replace(cleanChordsRegex, '');
};

export const getChordsDiff = (
  startingChordsLine: string,
  targetChord: string,
  locale: string
): number => {
  const chords = getChordsScale(locale);
  const initialChord = getInitialChord(startingChordsLine);
  const start = chords.indexOf(initialChord);
  const target = chords.indexOf(targetChord);
  return target - start;
};

export function isChordsLine(text: string, locale: string): boolean {
  if (text === undefined || locale === undefined) {
    throw 'isChordsLine: text or locale invalid';
  }
  const chords = getChordsScale(locale);
  const line = text
    .trim()
    .toLowerCase()
    .replace(cleanChordsRegex, ' ')
    .split(' ')
    .filter(i => i.length > 0);
  const onlyChords = line.filter(word => {
    return chords.find(ch => ch.toLowerCase() === word);
  });
  return onlyChords.length > 0 && onlyChords.length == line.length;
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

  assignInfoFromFile(info: Song, locale: string, parsed: SongFile) {
    info.nombre = parsed.nombre;
    info.titulo = parsed.titulo;
    info.fuente = parsed.fuente;
    info.locale = locale;
  }

  getSingleSongMeta(
    key: string,
    rawLoc: string,
    patch?: SongIndexPatch,
    ratings?: SongRatingFile
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
    this.assignInfoFromFile(info, loc, parsed);
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
        this.assignInfoFromFile(info, rawLoc, parsed);
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
    patch?: SongIndexPatch,
    ratings?: SongRatingFile
  ): Array<Song> {
    var songs = Object.keys(SongsIndex).map(key => {
      return this.getSingleSongMeta(key, rawLoc, patch, ratings);
    });
    songs.sort(ordenAlfabetico);
    return songs;
  }

  readLocaleSongs(rawLoc: string): Promise<Array<SongFile>> {
    // First try specific locale (with country included)
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
      .catch(() => {
        var locale = rawLoc.split('-')[0];
        if (locale !== rawLoc) {
          // If error, and locale contains country
          // code, try with country code removed
          return this.readLocaleSongs(locale);
        }
        // Locale inexistent
        return [];
      });
  }

  loadSingleSong(song: Song, patch?: SongIndexPatch): Promise<any> {
    return Promise.resolve()
      .then(() => {
        if (
          patch &&
          patch.hasOwnProperty(song.key) &&
          patch[song.key].hasOwnProperty(song.locale) &&
          patch[song.key][song.locale].hasOwnProperty('lines')
        ) {
          return patch[song.key][song.locale].lines;
        }
        return this.songReader(song.path);
      })
      .then(content => {
        if (content) {
          // Split lines, remove until reaching song notes
          var lineas = content.replace('\r\n', '\n').split('\n');
          while (lineas.length && !isChordsLine(lineas[0], song.locale)) {
            lineas.shift();
          }
          song.lines = lineas;
          song.fullText = lineas.join(' ');
        }
      })
      .catch(err => {
        console.log('loadSingleSong ERROR', err.message);
        song.error = err.message;
        song.lines = [];
        song.fullText = '';
      });
  }

  loadSongs(songs: Array<Song>, patch?: SongIndexPatch): Array<Promise<any>> {
    return songs.map(song => {
      return this.loadSingleSong(song, patch);
    });
  }

  /* eslint-disable no-unused-vars */
  getSongLineFromString(text: string, locale: string): SongLine {
    const psalmistAndAssembly = `${I18n.t('songs.psalmist', {
      locale
    })} ${I18n.t('songs.assembly', {
      locale
    })}`;
    if (text.startsWith(psalmistAndAssembly)) {
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
      text.startsWith(
        I18n.t('songs.psalmist', {
          locale
        })
      ) ||
      text.startsWith(
        I18n.t('songs.assembly', {
          locale
        })
      ) ||
      text.startsWith(
        I18n.t('songs.priest', {
          locale
        })
      ) ||
      text.startsWith(
        I18n.t('songs.men', {
          locale
        })
      ) ||
      text.startsWith(
        I18n.t('songs.women', {
          locale
        })
      ) ||
      text.startsWith(
        I18n.t('songs.children', {
          locale
        })
      )
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
      return it;
    } else if (isChordsLine(text, locale)) {
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

  getChordsTransported(
    chordsLine: string,
    diff: number,
    locale: string
  ): string {
    const notas = getChordsScale(locale);
    const notasInverted = notas.slice().reverse();
    const pedazos = chordsLine.split(' ');
    const result = pedazos.map(item => {
      const notaLimpia = item.replace(cleanChordsRegex, '');
      const notaIndex = notas.indexOf(notaLimpia);
      if (notaIndex !== -1) {
        const notaNuevoIndex = (notaIndex + diff) % 12;
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

  getSongLinesForRender(
    lines: Array<string>,
    locale: string,
    transportDiff?: number
  ): Array<SongLine> {
    const firstPass = lines.map(l => {
      const it = this.getSongLineFromString(l, locale);
      // Detectar indicadores de Nota al pie (un asterisco)
      if (it.texto.endsWith('\u2217')) {
        it.texto = it.texto.replace('\u2217', '');
        it.sufijo = '\u2217';
        it.sufijoStyle = this.songStyles.lineaNotas;
      }
      if (it.notas && transportDiff && transportDiff !== 0) {
        it.texto = this.getChordsTransported(it.texto, transportDiff, locale);
      }
      return it;
    });
    return firstPass.map((it, i) => {
      // Ajustar margen izquierdo por prefijos
      if (it.prefijo == '' && i > 0) {
        const prevIt = firstPass[i - 1];
        if (prevIt.prefijo !== '') {
          it.prefijo = ' '.repeat(prevIt.prefijo.length);
        }
      } else if (it.prefijo == '' && i < firstPass.length - 1) {
        const nextIt = firstPass[i + 1];
        if (nextIt.prefijo !== '') {
          it.prefijo = ' '.repeat(nextIt.prefijo.length);
        }
      }
      // Ajustar estilo para las notas
      if (it.texto.trim() == '' && i < firstPass.length - 1) {
        const nextItm = firstPass[i + 1];
        if (nextItm.canto) {
          it.style = this.songStyles.lineaNotas;
          it.notas = true;
        }
      }
      // Ajustar estilo para las notas si es la primer linea
      if (it.notas && i < firstPass.length - 1) {
        const nextItmn = firstPass[i + 1];
        if (nextItmn.prefijo !== '') {
          it.style = this.songStyles.lineaNotasConMargen;
          it.inicioParrafo = true;
        }
      }
      // Ajustar inicios de parrafo (lineas vacias)
      if (!it.notas && it.texto === '' && i < firstPass.length - 1) {
        const nextItmnn = firstPass[i + 1];
        if (nextItmnn.notas || nextItmnn.texto !== '') {
          it.inicioParrafo = true;
        }
      }
      return it;
    });
  }
}
