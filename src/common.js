// @flow
// Utilerias comunes (no atadas a react-native ni a NodeJS)
import normalize from 'normalize-strings';
import I18n from './translations';

var pdfVars = {
  fontName: 'Franklin Gothic Medium',
  marginLeft: 25,
  marginTop: 19,
  widthHeightPixels: 598, // 21,1 cm
  songTitle: { FontSize: 19, Spacing: 3 },
  songSource: { FontSize: 10, Spacing: 20 },
  songText: { FontSize: 12, Spacing: 11 },
  songNote: { FontSize: 10 },
  songIndicatorSpacing: 18,
  songParagraphSpacing: 9,
  indexTitle: { FontSize: 16, Spacing: 14 },
  indexSubtitle: { FontSize: 12, Spacing: 4 },
  indexText: { FontSize: 11, Spacing: 3 },
  indexExtraMarginLeft: 25,
  primerColumnaX: 0,
  segundaColumnaX: 0,
  primerColumnaIndexX: 0,
  segundaColumnaIndexX: 0
};

pdfVars.primerColumnaX = pdfVars.marginLeft;
pdfVars.segundaColumnaX =
  pdfVars.widthHeightPixels / 2 + pdfVars.primerColumnaX;
pdfVars.primerColumnaIndexX = pdfVars.marginLeft + pdfVars.indexExtraMarginLeft;
pdfVars.segundaColumnaIndexX =
  pdfVars.widthHeightPixels / 2 + pdfVars.indexExtraMarginLeft;

export const pdfValues = pdfVars;

export const asyncForEach = async (array: Array<any>, callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const getAlphaWithSeparators = (
  songsToPdf: Array<SongToPdf>
): Array<string> => {
  // Alfabetico
  var items = songsToPdf.map(data => {
    const sameName = songsToPdf.filter(
      d => d.canto.titulo === data.canto.titulo
    );
    return sameName.length > 1 ? data.canto.nombre : data.canto.titulo;
  });
  var i = 0;
  var letter = normalize(items[i][0]);
  while (i < items.length) {
    const curLetter = normalize(items[i][0]);
    if (curLetter !== letter) {
      letter = curLetter;
      items.splice(i, 0, '');
    }
    i++;
  }
  return items;
};

export const wayStages = [
  'precatechumenate',
  'liturgy',
  'catechumenate',
  'election'
];

export const getGroupedByStage = (songsToPdf: Array<SongToPdf>): any => {
  // Agrupados por stage
  return songsToPdf.reduce((groups, data) => {
    const groupKey = data.canto.stage;
    groups[groupKey] = groups[groupKey] || [];
    const sameName = songsToPdf.filter(
      d => d.canto.titulo === data.canto.titulo
    );
    const title = sameName.length > 1 ? data.canto.nombre : data.canto.titulo;
    groups[groupKey].push(title);
    return groups;
  }, {});
};

export const liturgicTimes = [
  'advent',
  'christmas',
  'lent',
  'easter',
  'pentecost'
];

export const getGroupedByLiturgicTime = (songsToPdf: Array<SongToPdf>): any => {
  // Agrupados por tiempo liturgico
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicTimes.filter(t => data.canto[t] === true);
    times.forEach(t => {
      groups[t] = groups[t] || [];
      const sameName = songsToPdf.filter(
        d => d.canto.titulo === data.canto.titulo
      );
      const title = sameName.length > 1 ? data.canto.nombre : data.canto.titulo;
      groups[t].push(title);
    });
    return groups;
  }, {});
};

export const liturgicOrder = [
  'signing to the virgin',
  /* eslint-disable quotes */
  "children's songs",
  /* eslint-enable quotes */
  'lutes and vespers',
  'entrance',
  'peace and offerings',
  'fraction of bread',
  'communion',
  'exit'
];

export const getGroupedByLiturgicOrder = (
  songsToPdf: Array<SongToPdf>
): any => {
  // Agrupados por tiempo liturgico
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicOrder.filter(t => data.canto[t] === true);
    times.forEach(t => {
      groups[t] = groups[t] || [];
      const sameName = songsToPdf.filter(
        d => d.canto.titulo === data.canto.titulo
      );
      const title = sameName.length > 1 ? data.canto.nombre : data.canto.titulo;
      groups[t].push(title);
    });
    return groups;
  }, {});
};

export class PdfWriter {
  pos: ExportToPdfCoord;
  pageNumber: number;
  resetY: number;
  limiteHoja: number;
  primerFilaY: number;
  pageNumberColor: any;
  titleColor: any;
  normalColor: any;
  sourceColor: any;
  noteColor: any;
  prefixColor: any;
  specialTitleColor: any;
  specialNoteColor: any;

  constructor(
    limiteHoja: number,
    primerFilaY: number,
    pageNumberColor: any,
    titleColor: any,
    normalColor: any,
    sourceColor: any,
    noteColor: any,
    prefixColor: any,
    specialTitleColor: any,
    specialNoteColor: any
  ) {
    this.limiteHoja = limiteHoja;
    this.primerFilaY = primerFilaY;
    this.pageNumberColor = pageNumberColor;
    this.titleColor = titleColor;
    this.normalColor = normalColor;
    this.sourceColor = sourceColor;
    this.noteColor = noteColor;
    this.prefixColor = prefixColor;
    this.specialTitleColor = specialTitleColor;
    this.specialNoteColor = specialNoteColor;
    this.pageNumber = 1;
    this.pos = {
      x: 0,
      y: 0
    };
  }

  positionIndex() {
    this.pos = {
      x: pdfValues.primerColumnaIndexX,
      y: this.primerFilaY
    };
  }

  positionSong() {
    this.pos = {
      x: pdfValues.primerColumnaX,
      y: this.primerFilaY
    };
  }

  positionStartLine() {
    this.pos = {
      x: pdfValues.primerColumnaX,
      y: this.pos.y
    };
  }

  checkLimitsCore(height: number) {
    throw 'Not implemented';
  }

  writeTextCore(
    text: string,
    color: any,
    font: string,
    size: number,
    xOffset?: number
  ) {
    throw 'Not implemented';
  }

  createPage() {
    throw 'Not implemented';
  }

  addPageToDocument() {
    throw 'Not implemented';
  }

  moveToNextLine(height: number) {
    throw 'Not implemented';
  }

  setNewColumnY(height: number) {
    throw 'Not implemented';
  }

  async writePageNumber() {
    this.pos.x = pdfValues.widthHeightPixels / 2;
    this.pos.y = this.limiteHoja;
    this.writeTextCore(
      this.pageNumber.toString(),
      this.pageNumberColor,
      pdfValues.fontName,
      pdfValues.songText.FontSize
    );
  }

  async checkLimits(height: number, firstCol: number, secondCol: number) {
    if (this.checkLimitsCore(height)) {
      if (this.pos.x == secondCol) {
        await this.writePageNumber();
        this.addPageToDocument();
        this.pageNumber++;
        this.pos.x = firstCol;
        this.resetY = this.primerFilaY;
        this.createPage();
      } else {
        this.pos.x = secondCol;
      }
      this.pos.y = this.resetY;
    }
  }

  async getCenteringX(text: string, font: string, size: number) {
    throw 'Not implemented';
  }

  async save() {
    throw 'Not implemented';
  }

  async writeTextCentered(
    text: string,
    color: any,
    font: string,
    size: number
  ) {
    var saveX = this.pos.x;
    this.pos.x = await this.getCenteringX(text, font, size);
    this.writeTextCore(text, color, font, size);
    this.pos.x = saveX;
  }

  async generateListing(title: string, items: any) {
    const height =
      pdfValues.indexSubtitle.FontSize + pdfValues.indexSubtitle.Spacing;
    await this.checkLimits(
      height,
      pdfValues.primerColumnaIndexX,
      pdfValues.segundaColumnaIndexX
    );
    this.writeTextCore(
      title.toUpperCase(),
      this.titleColor,
      pdfValues.fontName,
      pdfValues.indexSubtitle.FontSize
    );
    this.moveToNextLine(height);
    if (items) {
      const itemHeight =
        pdfValues.indexText.FontSize + pdfValues.indexText.Spacing;
      await asyncForEach(items, async str => {
        if (str !== '') {
          await this.checkLimits(
            itemHeight,
            pdfValues.primerColumnaIndexX,
            pdfValues.segundaColumnaIndexX
          );
          this.writeTextCore(
            str,
            this.normalColor,
            pdfValues.fontName,
            pdfValues.indexText.FontSize
          );
        }
        this.moveToNextLine(itemHeight);
      });
      if (this.pos.y !== this.primerFilaY) {
        this.moveToNextLine(itemHeight);
      }
    }
  }
}

export const PDFGenerator = async (
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  writer: PdfWriter
) => {
  try {
    // Indice
    if (opts.createIndex) {
      writer.createPage();
      writer.positionIndex();

      const height =
        pdfValues.indexTitle.FontSize + pdfValues.indexTitle.Spacing;
      await writer.writeTextCentered(
        I18n.t('ui.export.songs index').toUpperCase(),
        writer.titleColor,
        pdfValues.fontName,
        pdfValues.indexTitle.FontSize
      );
      writer.moveToNextLine(height);
      writer.setNewColumnY(0);

      // Alfabetico
      var items = getAlphaWithSeparators(songsToPdf);
      await writer.generateListing(I18n.t('search_title.alpha'), items);

      // Agrupados por stage
      var byStage = getGroupedByStage(songsToPdf);
      await asyncForEach(wayStages, async stage => {
        await writer.generateListing(
          I18n.t(`search_title.${stage}`),
          byStage[stage]
        );
      });

      // Agrupados por tiempo liturgico
      var byTime = getGroupedByLiturgicTime(songsToPdf);
      await asyncForEach(liturgicTimes, async (time, i) => {
        var title = I18n.t(`search_title.${time}`);
        if (i === 0) {
          title = I18n.t('search_title.liturgical time') + ` - ${title}`;
        }
        await writer.generateListing(title, byTime[time]);
      });

      // Agrupados por orden liturgico
      var byOrder = getGroupedByLiturgicOrder(songsToPdf);
      await asyncForEach(liturgicOrder, async order => {
        var title = I18n.t(`search_title.${order}`);
        await writer.generateListing(title, byOrder[order]);
      });
      await writer.writePageNumber();
      writer.addPageToDocument();
    }

    // Cantos
    await asyncForEach(songsToPdf, async data => {
      // Tomar canto y las lineas para renderizar
      const { canto, lines } = data;
      writer.createPage();
      writer.positionSong();
      await writer.writeTextCentered(
        canto.titulo.toUpperCase(),
        writer.titleColor,
        pdfValues.fontName,
        pdfValues.songTitle.FontSize
      );
      writer.moveToNextLine(
        pdfValues.songTitle.FontSize + pdfValues.songTitle.Spacing
      );
      await writer.writeTextCentered(
        canto.fuente,
        writer.sourceColor,
        pdfValues.fontName,
        pdfValues.songSource.FontSize
      );
      writer.positionStartLine();
      writer.moveToNextLine(
        pdfValues.songSource.FontSize + pdfValues.songSource.Spacing
      );
      writer.setNewColumnY(pdfValues.songParagraphSpacing);
      await asyncForEach(lines, async (it: SongLine) => {
        if (it.inicioParrafo) {
          writer.moveToNextLine(pdfValues.songParagraphSpacing);
        }
        if (it.tituloEspecial) {
          writer.moveToNextLine(pdfValues.songParagraphSpacing * 2);
        }
        var alturaExtra = 0;
        if (it.notas) {
          alturaExtra =
            pdfValues.songNote.FontSize + pdfValues.songText.Spacing;
        }
        await writer.checkLimits(
          alturaExtra,
          pdfValues.primerColumnaX,
          pdfValues.segundaColumnaX
        );
        if (it.notas === true) {
          writer.writeTextCore(
            it.texto,
            writer.noteColor,
            pdfValues.fontName,
            pdfValues.songNote.FontSize,
            pdfValues.songIndicatorSpacing
          );
          writer.moveToNextLine(pdfValues.songText.Spacing);
        } else if (it.canto === true) {
          writer.writeTextCore(
            it.texto,
            writer.normalColor,
            pdfValues.fontName,
            pdfValues.songText.FontSize,
            pdfValues.songIndicatorSpacing
          );
          writer.moveToNextLine(pdfValues.songText.Spacing);
        } else if (it.cantoConIndicador === true) {
          writer.writeTextCore(
            it.prefijo,
            writer.prefixColor,
            pdfValues.fontName,
            pdfValues.songText.FontSize
          );
          if (it.tituloEspecial === true) {
            writer.writeTextCore(
              it.texto,
              writer.specialTitleColor,
              pdfValues.fontName,
              pdfValues.songText.FontSize,
              pdfValues.songIndicatorSpacing
            );
          } else if (it.textoEspecial === true) {
            writer.writeTextCore(
              it.texto,
              writer.specialNoteColor,
              pdfValues.fontName,
              pdfValues.songText.FontSize - 3,
              pdfValues.songIndicatorSpacing
            );
          } else {
            writer.writeTextCore(
              it.texto,
              writer.normalColor,
              pdfValues.fontName,
              pdfValues.songText.FontSize,
              pdfValues.songIndicatorSpacing
            );
          }
          writer.moveToNextLine(pdfValues.songText.Spacing);
        }
      });
      if (opts.pageNumbers) {
        await writer.writePageNumber();
      }
      writer.addPageToDocument();
    });
    const path = await writer.save();
    return path;
  } catch (err) {
    console.log('generatePDF ERROR', err);
  }
};
