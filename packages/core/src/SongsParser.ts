import i18n from '@iresucito/translations';
import {
  cleanChordsRegex,
  cleanMultichord,
  getChordsScale,
  SongIndicator,
  SongLine,
  SongRendering,
  SongStyles,
} from './common';

export class SongsParser<T> {
  songStyles: SongStyles<T>;

  constructor(songStyles: SongStyles<T>) {
    this.songStyles = songStyles;
  }

  isChordsLine(text: string, locale: string): boolean {
    if (text === undefined || locale === undefined) {
      throw 'isChordsLine: text or locale invalid';
    }
    const chords = getChordsScale(locale);
    const line = text
      .trim()
      .replace(cleanChordsRegex, ' ')
      .split(' ')
      .filter((i) => i.length > 0);
    const onlyChords = line.filter((word) => {
      return chords.find((ch) => ch.test(word.toLowerCase()));
    });
    return onlyChords.length > 0 && onlyChords.length === line.length;
  }

  getSongItem(text: string, locale: string): SongLine<T> {
    if (text.startsWith('clamp:')) {
      const clampValue = text.substring(text.indexOf(':') + 1).trim();
      var it: SongLine<T> = {
        raw: text,
        texto: i18n.t('songs.clamp', { clamp: clampValue }),
        style: this.songStyles.clampLine,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        type: 'posicionAbrazadera',
      };
      return it;
    } else if (text.trim() === 'repeat') {
      var it: SongLine<T> = {
        raw: text,
        texto: '',
        style: null,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        type: 'bloqueRepetir',
      };
      return it;
    } else if (text.trim() === 'footnote') {
      var it: SongLine<T> = {
        raw: text,
        texto: '',
        style: null,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        type: 'bloqueNotaAlPie',
      };
      return it;
    } else if (text.trim() === 'column') {
      var it: SongLine<T> = {
        raw: text,
        texto: '',
        style: null,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        type: 'comenzarColumna',
      };
      return it;
    } else {
      const psalmistAndAssembly = `${i18n.t('songs.psalmist', {
        locale,
      })} ${i18n.t('songs.assembly', {
        locale,
      })}`;
      if (text.startsWith(psalmistAndAssembly)) {
        // Indicador de Salmista Y Asamblea
        var secondPoint = 4;
        var it: SongLine<T> = {
          raw: text,
          texto: text.substring(secondPoint + 1).trim(),
          style: this.songStyles.assemblyLine,
          prefijo: text.substring(0, secondPoint + 1) + ' ',
          prefijoStyle: this.songStyles.assemblyPrefix,
          sufijo: '',
          sufijoStyle: null,
          type: 'cantoConIndicador',
        };
        return it;
      } else if (
        text.startsWith(
          i18n.t('songs.psalmist', {
            locale,
          })
        ) ||
        text.startsWith(
          i18n.t('songs.assembly', {
            locale,
          })
        ) ||
        text.startsWith(
          i18n.t('songs.priest', {
            locale,
          })
        ) ||
        text.startsWith(
          i18n.t('songs.men', {
            locale,
          })
        ) ||
        text.startsWith(
          i18n.t('songs.women', {
            locale,
          })
        ) ||
        text.startsWith(
          i18n.t('songs.children', {
            locale,
          })
        )
      ) {
        // Asamblea: destacar con estilo diferente (mas negro)
        const isAssemblyLine = text.startsWith(
          i18n.t('songs.assembly', {
            locale,
          })
        );
        // Indicador de Salmista, Asamblea, Presbitero, Hombres, Mujeres, etc
        var pointIndex = text.indexOf('.');
        var it: SongLine<T> = {
          raw: text,
          texto: text.substring(pointIndex + 1).trim(),
          style: isAssemblyLine
            ? this.songStyles.assemblyLine
            : this.songStyles.normalLine,
          prefijo: text.substring(0, pointIndex + 1) + ' ',
          prefijoStyle: isAssemblyLine
            ? this.songStyles.assemblyPrefix
            : this.songStyles.normalPrefix,
          sufijo: '',
          sufijoStyle: null,
          type: 'cantoConIndicador',
        };
        return it;
      } else if (this.isChordsLine(text, locale)) {
        var it: SongLine<T> = {
          raw: text,
          texto: text.trimEnd(),
          style: this.songStyles.notesLine,
          prefijo: '',
          prefijoStyle: null,
          sufijo: '',
          sufijoStyle: null,
          type: 'notas',
        };
        return it;
      } else if (text.startsWith('* ')) {
        // Nota especial
        var it: SongLine<T> = {
          raw: text,
          texto: text.substring(1).trim(),
          style: this.songStyles.specialNote,
          prefijo: '* ',
          prefijoStyle: this.songStyles.notesLine,
          sufijo: '',
          sufijoStyle: null,
          type: 'notaEspecial',
        };
        return it;
      } else if (text.trim().startsWith('**') && text.trim().endsWith('**')) {
        // Titulo especial
        var it: SongLine<T> = {
          raw: text,
          texto: text.replace(/\*/g, '').trim(),
          style: this.songStyles.specialNoteTitle,
          prefijo: '',
          prefijoStyle: null,
          sufijo: '',
          sufijoStyle: null,
          type: 'tituloEspecial',
        };
        return it;
      } else if (text.startsWith('-')) {
        // Texto especial
        var it: SongLine<T> = {
          raw: text,
          texto: text.replace('-', '').trim(),
          style: this.songStyles.specialNote,
          prefijo: '',
          prefijoStyle: null,
          sufijo: '',
          sufijoStyle: null,
          type: 'textoEspecial',
        };
        return it;
      } else if (text.trim() === '') {
        var it: SongLine<T> = {
          raw: text,
          texto: '',
          style: this.songStyles.normalLine,
          prefijo: '',
          prefijoStyle: null,
          sufijo: '',
          sufijoStyle: null,
          type: 'inicioParrafo',
        };
        return it;
      } else {
        var texto = text.trimEnd();
        var it: SongLine<T> = {
          raw: text,
          texto: texto,
          style: this.songStyles.normalLine,
          prefijo: '',
          prefijoStyle: null,
          sufijo: '',
          sufijoStyle: null,
          type: 'canto',
        };
        return it;
      }
    }
  }

  getChordsTransported(
    chordsLine: string,
    diff: number,
    locale: string
  ): string {
    const chords = getChordsScale(locale);
    const chordsInverted = chords.slice().reverse();
    const allChords = chordsLine.split(' ');
    const convertedChords = allChords.map((chord) => {
      // Ej. Do#- (latino)
      // Ej. cis  (anglosajon)
      const cleanChord = chord.replace(cleanChordsRegex, '');
      // En de-AT, las notas menores son en minuscula...
      const isLower = cleanChord === cleanChord.toLowerCase();
      // Ej. Do
      // Ej. c
      // 'ch' es una expresion regular para matchear el texto
      const initial = chords.find((ch) => ch.test(cleanChord.toLowerCase()));
      if (initial) {
        const i = chords.indexOf(initial);
        if (i !== -1) {
          const j = (i + diff) % 12;
          var newChord =
            j < 0 ? chordsInverted[j * -1 - 1].source : chords[j].source;
          newChord = cleanMultichord(newChord);
          if (isLower) {
            newChord = newChord.toLowerCase();
          }
          if (cleanChord.length !== chord.length) {
            newChord += chord.substring(cleanChord.length);
          }
          return newChord;
        }
      }
      return chord;
    });
    return convertedChords.join(' ');
  }

  getInitialChord(linea: string): string {
    var pedazos = linea.trim().split(' ');
    var primero = pedazos[0];
    return primero.replace(cleanChordsRegex, '');
  }

  getChordsDiff(
    startingChordsLine: string,
    targetChord: string,
    locale: string
  ): number {
    const chords = getChordsScale(locale);
    const initialChord = this.getInitialChord(startingChordsLine);
    const st = chords.find((ch) => ch.test(initialChord.toLowerCase()));
    if (st) {
      const start = chords.indexOf(st);
      const tg = chords.find((ch) => ch.test(targetChord.toLowerCase()));
      if (tg) {
        const target = chords.indexOf(tg);
        return target - start;
      }
    }
    return 0;
  }

  getSongLines(content: string, locale: string): Array<SongLine<T>> {
    var items = content.replace('\r\n', '\n').split('\n');
    // Realizar la primer pasada
    var primerPasada = items.map((l) => {
      return this.getSongItem(l, locale);
    });
    // En primer pasada hay "inicioParrafo"
    // que por el contexto solo pueden detectarse
    // como "notas" en una segunda pasada
    var segundaPasada = primerPasada.map((l, i) => {
      if (l.type == 'inicioParrafo' && i > 0 && i < primerPasada.length - 1) {
        const anterior = primerPasada[i - 1];
        const siguiente = primerPasada[i + 1];
        if (
          siguiente.type == 'canto' &&
          (anterior.type == 'canto' || anterior.type == 'cantoConIndicador')
        ) {
          l.type = 'notas';
        }
      }
      return l;
    });
    // Finalmente, cada bloque de "asamblea" ó "salmista" (type == 'canto')
    // debe mantener el estilo (regular, medium) que viene aplicado del item anterior
    var estiloActual = null;
    var terceraPasada = segundaPasada.map((l, i) => {
      if (l.type == 'cantoConIndicador') {
        estiloActual = l.style;
      } else if (l.type == 'canto' && estiloActual) {
        l.style = estiloActual;
      }
      return l;
    });
    return terceraPasada;
  }

  getForRender(
    content: string,
    locale: string,
    transportToNote?: string
  ): SongRendering<T> {
    const asSongItem = this.getSongLines(content, locale);
    var tDiff = 0;
    if (transportToNote) {
      const fNotes = asSongItem.find((it) =>
        this.isChordsLine(it.texto, locale)
      );
      if (fNotes !== undefined) {
        tDiff = this.getChordsDiff(fNotes.texto, transportToNote, locale);
      }
    }
    const conversions = asSongItem.map((it) => {
      if (it.type === 'notas' && tDiff !== 0) {
        it.texto = this.getChordsTransported(it.texto, tDiff, locale);
      }
      // Detectar indicadores de Nota al pie (un asterisco)
      if (it.texto.endsWith('*')) {
        it.texto = it.texto.replace('*', '');
        it.sufijo = '*';
        it.sufijoStyle = this.songStyles.notesLine;
      }
      return it;
    });
    const adjustMargin = conversions.map((it: SongLine<T>, i: number) => {
      // Ajustar margen izquierdo por prefijos
      if (it.prefijo === '' && i > 0) {
        const prevIt = asSongItem[i - 1];
        if (
          prevIt.type !== 'bloqueRepetir' &&
          prevIt.type !== 'bloqueNotaAlPie' &&
          prevIt.prefijo !== ''
        ) {
          it.prefijo = ' '.repeat(prevIt.prefijo.length);
        }
      } else if (it.prefijo === '' && i < asSongItem.length - 1) {
        const nextIt = asSongItem[i + 1];
        if (
          nextIt.type !== 'bloqueRepetir' &&
          nextIt.type !== 'bloqueNotaAlPie' &&
          nextIt.prefijo !== ''
        ) {
          it.prefijo = ' '.repeat(nextIt.prefijo.length);
        }
      }
      return it;
    });
    // Extraer parrafos de BIS (repeat) y notas al pie (footnote)
    var lIndicators: Array<SongIndicator> = [];
    const finalItems = adjustMargin.filter((it: SongLine<T>, i: number) => {
      if (it.type === 'bloqueRepetir' || it.type === 'bloqueNotaAlPie') {
        var j = i - 1;
        while (j >= 0 && adjustMargin[j].type !== 'inicioParrafo') {
          j--;
        }
        lIndicators.push({
          start: j - lIndicators.length + 1,
          end: i - lIndicators.length,
          type: it.type,
        });
        return false;
      }
      return true;
    });
    const renderRes = {
      items: finalItems,
      indicators: lIndicators,
    };
    return renderRes;
  }
}
