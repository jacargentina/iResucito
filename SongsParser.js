// @flow
import I18n from './translations';
import { cleanChordsRegex, getChordsScale } from './common';

export class SongsParser {
  songStyles: SongStyles;

  constructor(songStyles: SongStyles) {
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
      .filter(i => i.length > 0);
    const onlyChords = line.filter(word => {
      return chords.find(ch => ch.toLowerCase() === word.toLowerCase());
    });
    return onlyChords.length > 0 && onlyChords.length == line.length;
  }

  getSongItem(text: string, locale: string): SongLine {
    if (text.startsWith('clamp:')) {
      const clampValue = text.substring(text.indexOf(':') + 1).trim();
      var it: SongLine = {
        texto: I18n.t('songs.clamp', { clamp: clampValue }),
        style: this.songStyles.clampLine,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        type: ''
      };
      return it;
    } else if (text.trim() == 'repeat') {
      var it: SongLine = {
        texto: '',
        style: null,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        type: 'bloqueRepetir'
      };
      return it;
    } else if (text.trim() == 'footnote') {
      var it: SongLine = {
        texto: '',
        style: null,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        type: 'bloqueNotaAlPie'
      };
      return it;
    } else if (text.trim() == 'column') {
      var it: SongLine = {
        texto: '',
        style: null,
        prefijo: '',
        prefijoStyle: null,
        sufijo: '',
        sufijoStyle: null,
        type: 'comenzarColumna'
      };
      return it;
    } else {
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
          style: this.songStyles.normalLine,
          prefijo: text.substring(0, secondPoint + 1) + ' ',
          prefijoStyle: this.songStyles.prefix,
          sufijo: '',
          sufijoStyle: null,
          type: 'cantoConIndicador'
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
          style: this.songStyles.normalLine,
          prefijo: text.substring(0, pointIndex + 1) + ' ',
          prefijoStyle: this.songStyles.prefix,
          sufijo: '',
          sufijoStyle: null,
          type: 'cantoConIndicador'
        };
        return it;
      } else if (this.isChordsLine(text, locale)) {
        var it: SongLine = {
          texto: text.trimRight(),
          style: this.songStyles.notesLine,
          prefijo: '',
          prefijoStyle: null,
          sufijo: '',
          sufijoStyle: null,
          type: 'notas'
        };
        return it;
      } else if (text.startsWith('\u2217')) {
        // Nota especial
        var it: SongLine = {
          texto: text.substring(1).trim(),
          style: this.songStyles.specialNote,
          prefijo: '\u2217  ',
          prefijoStyle: this.songStyles.notesLine,
          sufijo: '',
          sufijoStyle: null,
          type: 'cantoConIndicador'
        };
        return it;
      } else if (text.trim().startsWith('**') && text.trim().endsWith('**')) {
        // Titulo especial
        var it: SongLine = {
          texto: text.replace(/\*/g, '').trim(),
          style: this.songStyles.specialNoteTitle,
          prefijo: '',
          prefijoStyle: null,
          sufijo: '',
          sufijoStyle: null,
          type: 'cantoConIndicador'
        };
        return it;
      } else if (text.startsWith('-')) {
        // Texto especial
        var it: SongLine = {
          texto: text.replace('-', '').trim(),
          style: this.songStyles.specialNote,
          prefijo: '',
          prefijoStyle: null,
          sufijo: '',
          sufijoStyle: null,
          type: 'textoEspecial'
        };
        return it;
      } else {
        var texto = text.trimRight();
        var it: SongLine = {
          texto: texto,
          style: this.songStyles.normalLine,
          prefijo: '',
          prefijoStyle: null,
          sufijo: '',
          sufijoStyle: null,
          type: 'canto'
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
    const convertedChords = allChords.map(chord => {
      // Ej. Do#- (latino)
      // Ej. cis  (anglosajon)
      const cleanChord = chord.replace(cleanChordsRegex, '');
      // En de-AT, las notas menores son en minuscula...
      const isLower = cleanChord == cleanChord.toLowerCase();
      // Ej. Do
      // Ej. c
      const initial = chords.find(
        ch => ch.toLowerCase() == cleanChord.toLowerCase()
      );
      const i = chords.indexOf(initial);
      if (i !== -1) {
        const j = (i + diff) % 12;
        var newChord = j < 0 ? chordsInverted[j * -1] : chords[j];
        if (isLower) {
          newChord = newChord.toLowerCase();
        }
        if (cleanChord.length !== chord.length)
          newChord += chord.substring(cleanChord.length);
        return newChord;
      }
      return chord;
    });
    return convertedChords.join(' ');
  }

  getInitialChord(linea: string): string {
    var pedazos = linea.split(' ');
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
    const st = chords.find(
      ch => ch.toLowerCase() == initialChord.toLowerCase()
    );
    const start = chords.indexOf(st);
    const tg = chords.find(ch => ch.toLowerCase() == targetChord.toLowerCase());
    const target = chords.indexOf(tg);
    return target - start;
  }

  getForRender(
    content: string,
    locale: string,
    transportToNote?: string
  ): SongRendering {
    var items = content.replace('\r\n', '\n').split('\n');
    var fNotes = items.find(l => this.isChordsLine(l, locale));
    var fNotesIdx = fNotes ? items.indexOf(fNotes) : undefined;
    var tDiff = 0;
    if (fNotesIdx && transportToNote) {
      tDiff = this.getChordsDiff(items[fNotesIdx], transportToNote, locale);
    }
    const lFirstPass = items.map(l => {
      const it = this.getSongItem(l, locale);
      // Detectar indicadores de Nota al pie (un asterisco)
      if (it.texto.endsWith('\u2217')) {
        it.texto = it.texto.replace('\u2217', '');
        it.sufijo = '\u2217';
        it.sufijoStyle = this.songStyles.notesLine;
      }
      if (it.type == 'notas' && tDiff && tDiff !== 0) {
        it.texto = this.getChordsTransported(it.texto, tDiff, locale);
      }
      return it;
    });
    const lSecondPass = lFirstPass.map((it: SongLine, i: number) => {
      // Ajustar margen izquierdo por prefijos
      if (it.prefijo == '' && i > 0) {
        const prevIt = lFirstPass[i - 1];
        if (
          prevIt.type !== 'bloqueRepetir' &&
          prevIt.type !== 'bloqueNotaAlPie' &&
          prevIt.prefijo !== ''
        ) {
          it.prefijo = ' '.repeat(prevIt.prefijo.length);
        }
      } else if (it.prefijo == '' && i < lFirstPass.length - 1) {
        const nextIt = lFirstPass[i + 1];
        if (
          nextIt.type !== 'bloqueRepetir' &&
          nextIt.type !== 'bloqueNotaAlPie' &&
          nextIt.prefijo !== ''
        ) {
          it.prefijo = ' '.repeat(nextIt.prefijo.length);
        }
      }
      // Ajustar estilo para las notas
      if (it.texto.trim() == '' && i < lFirstPass.length - 1) {
        const nextItm = lFirstPass[i + 1];
        if (nextItm.type == 'canto') {
          it.style = this.songStyles.notesLine;
          it.type = 'notas';
        }
      }
      // Ajustar inicios de parrafo (lineas vacias)
      if (
        it.type !== 'notas' &&
        it.type !== 'comenzarColumna' &&
        it.texto === '' &&
        i < lFirstPass.length - 1
      ) {
        const nextItmnn = lFirstPass[i + 1];
        if (nextItmnn.type == 'notas' || nextItmnn.texto !== '') {
          it.type = 'inicioParrafo';
        }
      }
      return it;
    });
    // Extraer parrafos de BIS (repeat) y notas al pie (footnote)
    var lIndicators: Array<SongIndicator> = [];
    const lResult = lSecondPass.filter((it: SongLine, i: number) => {
      if (it.type == 'bloqueRepeat' || it.type == 'bloqueFootnote') {
        var j = i - 1;
        while (j > 0 && !lSecondPass[j].inicioParrafo) {
          j--;
        }
        lIndicators.push({
          start: j,
          end: i,
          type: it.type
        });
        return false;
      }
      return true;
    });
    const renderRes = {
      firstNotes: fNotesIdx,
      items: lResult,
      indicators: lIndicators
    };
    return renderRes;
  }
}
