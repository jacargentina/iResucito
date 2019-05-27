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
        case: 1,
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
        case: 2,
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
    } else if (this.isChordsLine(text, locale)) {
      var it: SongLine = {
        case: 3,
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
        case: 4,
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
        case: 5,
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
        case: 6,
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
        case: 7,
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

  getLinesSection(
    content: string,
    locale: string
  ): { start: number, items: Array<string> } {
    var items = content.replace('\r\n', '\n').split('\n');
    var firstNotes = items.find(l => this.isChordsLine(l, locale));
    var idx = -1;
    if (firstNotes) {
      idx = items.indexOf(firstNotes);
      items.splice(0, idx);
    }
    return { start: idx, items };
  }

  getForRender(
    content: string,
    locale: string,
    transportToNote?: string
  ): SongRendering {
    const lSection = this.getLinesSection(content, locale);
    var tDiff = 0;
    if (transportToNote) {
      tDiff = this.getChordsDiff(lSection.items[0], transportToNote, locale);
    }
    const lFirstPass = lSection.items.map(l => {
      const it = this.getSongLineFromString(l, locale);
      // Detectar indicadores de Nota al pie (un asterisco)
      if (it.texto.endsWith('\u2217')) {
        it.texto = it.texto.replace('\u2217', '');
        it.sufijo = '\u2217';
        it.sufijoStyle = this.songStyles.lineaNotas;
      }
      if (it.notas && tDiff && tDiff !== 0) {
        it.texto = this.getChordsTransported(it.texto, tDiff, locale);
      }
      return it;
    });
    const lResult = lFirstPass.map((it, i) => {
      // Ajustar margen izquierdo por prefijos
      if (it.prefijo == '' && i > 0) {
        const prevIt = lFirstPass[i - 1];
        if (prevIt.prefijo !== '') {
          it.prefijo = ' '.repeat(prevIt.prefijo.length);
        }
      } else if (it.prefijo == '' && i < lFirstPass.length - 1) {
        const nextIt = lFirstPass[i + 1];
        if (nextIt.prefijo !== '') {
          it.prefijo = ' '.repeat(nextIt.prefijo.length);
        }
      }
      // Ajustar estilo para las notas
      if (it.texto.trim() == '' && i < lFirstPass.length - 1) {
        const nextItm = lFirstPass[i + 1];
        if (nextItm.canto) {
          it.style = this.songStyles.lineaNotas;
          it.notas = true;
        }
      }
      // Ajustar estilo para las notas si es la primer linea
      if (it.notas && i < lFirstPass.length - 1) {
        const nextItmn = lFirstPass[i + 1];
        if (nextItmn.prefijo !== '') {
          it.style = this.songStyles.lineaNotasConMargen;
          it.inicioParrafo = true;
        }
      }
      // Ajustar inicios de parrafo (lineas vacias)
      if (!it.notas && it.texto === '' && i < lFirstPass.length - 1) {
        const nextItmnn = lFirstPass[i + 1];
        if (nextItmnn.notas || nextItmnn.texto !== '') {
          it.inicioParrafo = true;
        }
      }
      return it;
    });

    return { lines: { start: lSection.start, items: lResult } };
  }
}
