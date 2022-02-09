// Utilerias comunes (no atadas a react-native ni a NodeJS)
import normalize from 'normalize-strings';
import langs from 'langs';
import countries from 'country-list';
import * as _ from 'lodash';
import I18n from './translations';
const PDFDocument = require('./pdfkit.standalone.js');

export const getLocalizedListItem = (listKey: string): string => {
  return I18n.t(`list_item.${listKey}`);
};

export const getLocalizedListType = (
  listType: string,
  localeValue: string
): string => {
  switch (listType) {
    case 'eucaristia':
      return I18n.t('list_type.eucharist', { locale: localeValue });
    case 'palabra':
      return I18n.t('list_type.word', { locale: localeValue });
    case 'libre':
      return I18n.t('list_type.other', { locale: localeValue });
    default:
      return '';
  }
};

export const getEsSalmo = (listKey: string): boolean => {
  return (
    listKey === 'entrada' ||
    listKey === '1-salmo' ||
    listKey === '2-salmo' ||
    listKey === '3-salmo' ||
    listKey === 'paz' ||
    listKey === 'comunion-pan' ||
    listKey === 'comunion-caliz' ||
    listKey === 'salida'
  );
};

export const defaultExportToPdfOptions: ExportToPdfOptions = {
  useTimesRomanFont: false,
  marginLeft: 25,
  marginTop: 19,
  widthHeightPixels: 598, // 21,1 cm
  songTitle: { FontSize: 19 },
  songSource: { FontSize: 10 },
  songText: { FontSize: 12 },
  songNote: { FontSize: 10 },
  songIndicatorSpacing: 21,
  songParagraphSpacing: 9,
  indexTitle: { FontSize: 16 },
  bookTitle: { FontSize: 80, Spacing: 10 },
  bookSubtitle: { FontSize: 14 },
  indexText: { FontSize: 11 },
  indexMarginLeft: 25,
  disablePageNumbers: false,
  pageNumber: { FontSize: 12 },
  pageFooter: { FontSize: 10 },
};

export const cleanChordsRegex: any =
  /\[|\]|\(|\)|#|\*|5|6|7|9|b|-|\+|\/|\u2013|aum|dim|sus|m|is|IS/g;

export const getChordsScale = (locale: string): Array<string> => {
  return I18n.t('chords.scale', { locale }).split(' ');
};

export const getPropertyLocale = (obj: any, rawLoc: string): string => {
  if (obj.hasOwnProperty(rawLoc)) {
    return rawLoc;
  } else {
    const locale = rawLoc.split('-')[0];
    if (obj.hasOwnProperty(locale)) {
      return locale;
    }
    return '';
  }
};

export const getLocaleLabel = (code: string): string => {
  if (!code) {
    return 'code is empty';
  }
  const parts = code.split('-');
  const l = langs.where('1', parts[0]);
  if (!l) {
    return `Unknown code = "${code}"`;
  }
  var label = l.local;
  if (parts.length > 1) {
    const countryName = countries.getName(parts[1]);
    if (countryName) {
      label += ` (${countryName})`;
    }
  }
  return label;
};

export const getLocalesForPicker = (
  defaultLocale?: string
): Array<PickerLocale> => {
  var locales = [];
  if (defaultLocale) {
    locales.push({
      label: `${I18n.t('ui.default')} - ${getLocaleLabel(defaultLocale)}`,
      value: 'default',
    });
  }
  for (var code in I18n.translations) {
    locales.push({ label: getLocaleLabel(code), value: code });
  }
  locales.sort((a, b) => a.label.localeCompare(b.label));
  return locales;
};

export const getValidatedLocale = (
  availableLocales: Array<PickerLocale>,
  locale: string
): PickerLocale | undefined => {
  if (!locale) {
    return undefined;
  }
  const loc = locale.split('-')[0];
  const best = availableLocales.find(
    (l) => l.value === locale || l.value === loc
  );
  return best;
};

export const asyncForEach = async (array: Array<any>, callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const getAlphaWithSeparators = (
  songsToPdf: Array<SongToPdf>
): Array<ListSongItem> => {
  // Alfabetico
  var items: Array<ListSongItem> = songsToPdf.map((data) => {
    const sameName = songsToPdf.filter(
      (d) => d.song.titulo === data.song.titulo
    );
    const str = sameName.length > 1 ? data.song.nombre : data.song.titulo;
    return { songKey: data.song.key, str };
  });
  var i = 0;
  var letter = normalize(items[i].str[0]);
  while (i < items.length) {
    const curLetter = normalize(items[i].str[0]);
    if (curLetter !== letter) {
      letter = curLetter;
      items.splice(i, 0, { songKey: '', str: '' });
    }
    i++;
  }
  return items;
};

export const wayStages = [
  'precatechumenate',
  'liturgy',
  'catechumenate',
  'election',
];

export const getGroupedByStage = (
  songsToPdf: Array<SongToPdf>
): ListSongGroup => {
  // Agrupados por stage
  return songsToPdf.reduce((groups, data) => {
    const groupKey = data.song.stage;
    groups[groupKey] = groups[groupKey] || [];
    const sameName = songsToPdf.filter(
      (d) => d.song.titulo === data.song.titulo
    );
    const title = sameName.length > 1 ? data.song.nombre : data.song.titulo;
    groups[groupKey].push({ songKey: data.song.key, str: title });
    return groups;
  }, {});
};

export const liturgicTimes = [
  'advent',
  'christmas',
  'lent',
  'easter',
  'pentecost',
];

export const getGroupedByLiturgicTime = (
  songsToPdf: Array<SongToPdf>
): ListSongGroup => {
  // Agrupados por tiempo liturgico
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicTimes.filter((t) => data.song[t] === true);
    times.forEach((t) => {
      groups[t] = groups[t] || [];
      const sameName = songsToPdf.filter(
        (d) => d.song.titulo === data.song.titulo
      );
      const title = sameName.length > 1 ? data.song.nombre : data.song.titulo;
      groups[t].push({ songKey: data.song.key, str: title });
    });
    return groups;
  }, {});
};

export const liturgicOrder = [
  'signing to the virgin',
  "children's songs",
  'lutes and vespers',
  'entrance',
  'peace and offerings',
  'fraction of bread',
  'communion',
  'exit',
];

export const getGroupedByLiturgicOrder = (
  songsToPdf: Array<SongToPdf>
): ListSongGroup => {
  // Agrupados por tiempo liturgico
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicOrder.filter((t) => data.song[t] === true);
    times.forEach((t) => {
      groups[t] = groups[t] || [];
      const sameName = songsToPdf.filter(
        (d) => d.song.titulo === data.song.titulo
      );
      const title = sameName.length > 1 ? data.song.nombre : data.song.titulo;
      groups[t].push({ songKey: data.song.key, str: title });
    });
    return groups;
  }, {});
};

export const PdfStyles: SongStyles = {
  title: { color: '#ff0000' },
  source: { color: '#777777' },
  clampLine: { color: '#ff0000' },
  indicator: { color: '#ff0000' },
  notesLine: { color: '#ff0000' },
  specialNoteTitle: { color: '#ff0000' },
  specialNote: { color: '#444444' },
  normalLine: { color: '#000000' },
  pageNumber: { color: '#000000' },
  pageFooter: { color: '#777777' },
  prefix: { color: '#777777' },
};

var DEBUG_RECTS = false;

export class PdfWriter {
  opts: ExportToPdfOptions;
  resetY: number;
  doc: any;
  base64Transform: any;
  addExtraMargin: boolean;
  disablePageNumbers: boolean;
  listing: Array<ListSongPos>;
  limits: ExportToPdfLimits;
  pageNumberLimits: ExportToPdfLimits;
  firstColLimits: ExportToPdfLimits;
  secondColLimits: ExportToPdfLimits;
  widthOfIndexPageNumbers: number;
  heightOfPageNumbers: number;
  widthOfIndexSpacing: number;

  constructor(
    fontBuf: any,
    base64Transform: any,
    opts: ExportToPdfOptions = defaultExportToPdfOptions
  ) {
    this.base64Transform = base64Transform;
    this.opts = opts;
    this.doc = new PDFDocument({
      bufferPages: true,
      autoFirstPage: false,
      margins: {
        top: this.opts.marginTop,
        bottom: this.opts.marginTop,
        left:
          this.opts.marginLeft +
          (this.addExtraMargin ? this.opts.indexMarginLeft : 0),
        right:
          this.opts.marginLeft +
          (this.addExtraMargin ? this.opts.indexMarginLeft : 0),
      },
      size: [this.opts.widthHeightPixels, this.opts.widthHeightPixels],
    });
    this.doc.on('pageAdded', () => {
      this.widthOfIndexPageNumbers = this.doc
        .fontSize(this.opts.indexText.FontSize)
        .widthOfString('000');
      this.heightOfPageNumbers = this.doc
        .fontSize(this.opts.songText.FontSize)
        .heightOfString('000');
      this.widthOfIndexSpacing = this.doc
        .fontSize(this.opts.indexText.FontSize)
        .widthOfString('  ');
      this.resetY = this.opts.marginTop;
      this.limits = {
        x: this.doc.page.margins.left,
        y: this.doc.page.margins.top,
        w:
          this.opts.widthHeightPixels -
          this.doc.page.margins.right -
          this.doc.page.margins.left,
        h:
          this.opts.widthHeightPixels -
          this.doc.page.margins.bottom -
          this.doc.page.margins.top,
      };
      this.pageNumberLimits = {
        x: this.limits.x,
        y:
          this.opts.widthHeightPixels -
          this.doc.page.margins.bottom -
          this.heightOfPageNumbers,
        w: this.limits.w,
        h: this.heightOfPageNumbers,
      };
      this.firstColLimits = {
        x: this.limits.x,
        y: this.limits.y,
        w: this.limits.w / 2,
        h: this.limits.h,
      };
      this.secondColLimits = {
        x: this.firstColLimits.x + this.firstColLimits.w,
        y: this.limits.y,
        w: this.firstColLimits.w,
        h: this.limits.h,
      };
      if (DEBUG_RECTS === true) {
        const drawLimits = (limits, color) => {
          const { x, y, w, h } = limits;
          this.doc.rect(x, y, w, h).stroke(color);
        };
        drawLimits(this.limits, '#888');
        drawLimits(this.pageNumberLimits, '#666');
        drawLimits(this.firstColLimits, '#3333aa');
        drawLimits(this.secondColLimits, '#aa3333');
      }
    });
    this.doc.info = {
      Title: 'iResucitó',
      Author: 'iResucitó app',
      Subject: 'iResucitó Song Book',
      Keywords: 'Neocatechumenal songs',
    };
    if (fontBuf) {
      this.doc.registerFont('thefont', fontBuf);
      this.doc.font('thefont');
    } else {
      this.doc.font('Times-Roman');
    }
    this.listing = [];
    this.addExtraMargin = false;
  }

  writePageNumber() {
    this.doc.x = this.doc.page.margins.left;
    this.doc.y = this.pageNumberLimits.y;
    if (!this.disablePageNumbers) {
      this.writeText(
        this.doc.page.pageNumber.toString(),
        PdfStyles.pageNumber.color,
        this.opts.pageNumber.FontSize,
        {
          lineBreak: false,
          align: 'center',
          width:
            this.opts.widthHeightPixels -
            this.doc.page.margins.left -
            this.doc.page.margins.right,
          height: this.heightOfPageNumbers,
        }
      );
    }
  }

  writePageFooterText(text: string) {
    this.doc.x = this.doc.page.margins.left;
    this.doc.y = this.pageNumberLimits.y;
    this.writeText(
      text,
      PdfStyles.pageFooter.color,
      this.opts.pageFooter.FontSize,
      {
        lineBreak: false,
        align: 'center',
        width:
          this.opts.widthHeightPixels -
          this.doc.page.margins.left -
          this.doc.page.margins.right,
        height: this.heightOfPageNumbers,
      }
    );
  }

  checkLimits(lineCount: number = 1, nextHeight: number = 0): boolean {
    var pageWasAdded = false;
    if (
      this.doc.y + this.doc.currentLineHeight(false) * lineCount + nextHeight >
      this.pageNumberLimits.y
    ) {
      if (this.doc.x === this.secondColLimits.x) {
        const pn = this.doc.page.pageNumber;
        this.writePageNumber();
        this.doc.addPage();
        this.doc.page.pageNumber = pn + 1;
        pageWasAdded = true;
      } else {
        this.doc.x = this.secondColLimits.x;
      }
      this.doc.y = this.resetY;
    }
    return pageWasAdded;
  }

  startColumn() {
    if (this.doc.x !== this.secondColLimits.x) {
      this.doc.x = this.secondColLimits.x;
      this.doc.y = this.resetY;
    }
  }

  getCenteringY(text: string, size: number): number {
    const height = this.doc.fontSize(size).heightOfString(text);
    return parseInt((this.opts.widthHeightPixels - height) / 2, 10);
  }

  writeText(text: string, color: any, size: number, opts?: any): number {
    this.doc.fillColor(color).fontSize(size).text(text, opts);
    return (
      this.doc.fontSize(size).widthOfString(text) +
      (opts && opts.indent ? opts.indent : 0)
    );
  }

  drawLineText(line: ExportToPdfLineText, size: number) {
    this.doc.switchToPage(line.page);
    this.doc
      .moveTo(line.x, line.startY)
      .lineTo(line.x, line.endY)
      .stroke(line.color);
    const middle = (line.endY - line.startY) / 2;
    this.doc
      .fillColor(line.color)
      .fontSize(size)
      .text(line.text, line.x + 10, line.startY + middle - size, {
        lineBreak: false,
      });
  }

  async save(): Promise<string> {
    return new Promise((resolve, reject) => {
      var stream = this.doc.pipe(this.base64Transform);
      var str = '';
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('data', (data) => {
        str += data;
      });
      stream.on('finish', () => {
        resolve(str);
      });
      this.doc.end();
    });
  }

  generateListing(title: string, items: Array<ListSongItem>) {
    this.checkLimits(2);
    this.writeText(
      title.toUpperCase(),
      PdfStyles.title.color,
      this.opts.indexText.FontSize
    );
    if (items) {
      items.forEach((item: ListSongItem) => {
        if (item.str === '') {
          this.doc.moveDown();
        } else {
          const txtOpts = {
            width:
              this.firstColLimits.w -
              this.widthOfIndexPageNumbers -
              this.widthOfIndexSpacing,
          };
          const txtHeight = this.doc
            .fontSize(this.opts.indexText.FontSize)
            .heightOfString(item.str, txtOpts);
          this.checkLimits(0, txtHeight);
          this.writeText(
            item.str,
            PdfStyles.normalLine.color,
            this.opts.indexText.FontSize,
            txtOpts
          );
          this.listing.push({
            page: this.doc.page.pageNumber,
            songKey: item.songKey,
            x:
              this.doc.x < this.secondColLimits.x
                ? this.firstColLimits.x + this.firstColLimits.w
                : this.secondColLimits.x + this.secondColLimits.w,
            y: this.doc.y - this.doc.currentLineHeight(false),
            value: 0,
          });
        }
      });
    }
  }

  finalizeListing() {
    if (this.listing.length > 0) {
      for (var i = 0; i < this.doc._pageBuffer.length; i++) {
        this.doc.switchToPage(i);
        var items = this.listing.filter((l) => l.page === i);
        items.forEach((l: ListSongPos) => {
          this.doc.x =
            l.x - this.widthOfIndexPageNumbers - this.widthOfIndexSpacing * 2;
          this.doc.y = l.y;
          this.writeText(
            l.value.toString(),
            PdfStyles.normalLine.color,
            this.opts.indexText.FontSize,
            {
              width: this.widthOfIndexPageNumbers + this.widthOfIndexSpacing,
              align: 'right',
            }
          );
        });
      }
    }
  }
}

export const SongPDFGenerator = async (
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  writer: PdfWriter
): Promise<string> => {
  try {
    writer.disablePageNumbers = opts.disablePageNumbers;
    if (songsToPdf.length > 1) {
      // Portada
      writer.addExtraMargin = true;
      writer.doc.addPage();
      const title = I18n.t('ui.export.songs book title').toUpperCase();
      const subtitle = I18n.t('ui.export.songs book subtitle').toUpperCase();

      // Escalar titulo - en español "Resucitó" (9 letras) (A) => pdfValues.bookTitle.FontSize (B)
      // Para otra longitud, cual seria el font size? "Er ist auferstanden" (19 letras) (C) => (X)
      // Regla de 3 inversa X = A * B / C

      const A = I18n.t('ui.export.songs book title', {
        locale: 'es',
      }).length;
      const B = writer.opts.bookTitle.FontSize;
      const C = title.length;
      const X = (A * B) / C;

      const titleFontSize = Math.trunc(X);

      // Titulo
      writer.doc.y = writer.getCenteringY(
        title,
        titleFontSize +
          writer.opts.bookTitle.Spacing +
          writer.opts.bookSubtitle.FontSize
      );
      writer.writeText(title, PdfStyles.title.color, titleFontSize, {
        align: 'center',
      });

      // Subtitulo
      writer.writeText(
        subtitle,
        PdfStyles.normalLine.color,
        writer.opts.bookSubtitle.FontSize,
        {
          align: 'center',
        }
      );

      //Indice
      writer.doc.addPage();
      writer.doc.page.pageNumber = 1;
      writer.writeText(
        I18n.t('ui.export.songs index').toUpperCase(),
        PdfStyles.title.color,
        writer.opts.indexTitle.FontSize,
        { align: 'center' }
      );

      // Linea de espacio antes del primer item listado
      writer.doc.moveDown();
      // Posicion de reset para segunda columna
      writer.resetY = writer.doc.y;

      // Alfabetico
      var alphaItems = getAlphaWithSeparators(songsToPdf);
      writer.generateListing(I18n.t('search_title.alpha'), alphaItems);

      writer.doc.moveDown();

      // Agrupados por stage
      var byStage = getGroupedByStage(songsToPdf);
      wayStages.forEach((stage) => {
        writer.generateListing(I18n.t(`search_title.${stage}`), byStage[stage]);
        writer.doc.moveDown();
      });

      // Agrupados por tiempo liturgico
      var byTime = getGroupedByLiturgicTime(songsToPdf);
      liturgicTimes.forEach((time, i) => {
        var titleTime = I18n.t(`search_title.${time}`);
        if (i === 0) {
          titleTime =
            I18n.t('search_title.liturgical time') + ` - ${titleTime}`;
        }
        writer.generateListing(titleTime, byTime[time]);
        writer.doc.moveDown();
      });

      // Agrupados por orden liturgico
      var byOrder = getGroupedByLiturgicOrder(songsToPdf);
      liturgicOrder.forEach((order) => {
        var titleOrder = I18n.t(`search_title.${order}`);
        writer.generateListing(titleOrder, byOrder[order]);
        writer.doc.moveDown();
      });

      writer.writePageNumber();
    }

    writer.addExtraMargin = false;
    // Cantos
    songsToPdf.forEach((data: SongToPdf) => {
      const { song, render } = data;
      const { items, indicators } = render;

      const next = writer.doc.page ? writer.doc.page.pageNumber + 1 : 0;
      writer.doc.addPage();
      writer.doc.page.pageNumber = next;

      // Titulo del canto
      writer.writeText(
        song.titulo.toUpperCase(),
        PdfStyles.title.color,
        writer.opts.songTitle.FontSize,
        { align: 'center' }
      );

      // Fuente
      writer.writeText(
        song.fuente,
        PdfStyles.source.color,
        writer.opts.songSource.FontSize,
        { align: 'center' }
      );

      // Linea de espacio antes de las primeras notas
      writer.doc.moveDown();
      // Posicion de reset para segunda columna
      writer.resetY = writer.doc.y;

      var lines: Array<ExportToPdfLineText> = [];
      var blockIndicator;
      var blockY;
      var maxX = 0;
      items.forEach((it: SongLine, i: number) => {
        var lastWidth: number = 0;
        if (i > 0 && it.type === 'inicioParrafo') {
          writer.doc.moveDown();
        }
        if (i > 0 && it.type === 'tituloEspecial') {
          writer.doc.moveDown();
          writer.doc.moveDown();
        }
        if (indicators.find((r) => r.start === i)) {
          blockIndicator = indicators.find((r) => r.start === i);
          blockY = writer.doc.y;
        }
        if (blockIndicator && blockIndicator.end === i) {
          var text = '';
          var color = PdfStyles.indicator.color;
          if (blockIndicator.type === 'bloqueRepetir') {
            text = I18n.t('songs.repeat');
          } else if (blockIndicator.type === 'bloqueNotaAlPie') {
            text = '*';
          }
          lines.push({
            page: writer.doc._pageBuffer.length - 1,
            startY: blockY,
            endY: writer.doc.y - writer.doc.currentLineHeight(false),
            x: maxX + 10,
            text,
            color,
          });
          blockIndicator = null;
          blockY = 0;
        }
        if (it.type === 'comenzarColumna') {
          writer.startColumn();
        }
        // Sólo verificar limites para agregar nueva pagina
        // cuando no es el último item. Por ej. un "inicioParrafo" al final
        // generaría una pagina final en blanco indeseada
        if (i !== items.length - 1) {
          writer.checkLimits(it.type === 'notas' ? 2 : 1);
        }
        if (it.type === 'notas') {
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.notesLine.color,
            writer.opts.songNote.FontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'canto') {
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.normalLine.color,
            writer.opts.songText.FontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'cantoConIndicador') {
          maxX = 0;
          lastWidth = writer.writeText(
            it.prefijo,
            PdfStyles.prefix.color,
            writer.opts.songText.FontSize
          );
          writer.doc.moveUp();
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.normalLine.color,
            writer.opts.songText.FontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'tituloEspecial') {
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.specialNoteTitle.color,
            writer.opts.songText.FontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'textoEspecial') {
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.specialNote.color,
            writer.opts.songText.FontSize - 3,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'notaEspecial') {
          lastWidth = writer.writeText(
            it.prefijo,
            PdfStyles.prefix.color,
            writer.opts.songText.FontSize
          );
          writer.doc.moveUp();
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.specialNote.color,
            writer.opts.songText.FontSize - 3,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type === 'posicionAbrazadera') {
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.clampLine.color,
            writer.opts.songNote.FontSize
          );
          writer.doc.moveDown();
        }
        if (it.sufijo) {
          writer.doc.moveUp();
          const lastX = writer.doc.x;
          writer.doc.x = writer.doc.x + lastWidth;
          lastWidth = writer.writeText(
            it.sufijo,
            PdfStyles.indicator.color,
            writer.opts.songText.FontSize
          );
          writer.doc.x = lastX;
        }
        maxX = Math.trunc(Math.max(writer.doc.x + lastWidth, maxX));
      });
      lines.forEach((line: ExportToPdfLineText) => {
        writer.drawLineText(line, writer.opts.songText.FontSize);
      });
      // Ir al final
      writer.doc.switchToPage(writer.doc._pageBuffer.length - 1);
      if (songsToPdf.length > 1) {
        writer.writePageNumber();
        const assignItems = writer.listing.filter(
          (l) => l.songKey === song.key
        );
        assignItems.forEach((i) => {
          i.value = writer.doc.page.pageNumber;
        });
      }
    });
    writer.finalizeListing();
    return await writer.save();
  } catch (err) {
    console.log('SongPDFGenerator ERROR', err);
  }
  return '';
};

export const ListPDFGenerator = async (
  list: ListToPdf,
  opts: ExportToPdfOptions,
  writer: PdfWriter
): Promise<string> => {
  try {
    writer.disablePageNumbers = true;
    writer.addExtraMargin = true;
    writer.doc.addPage();

    const title = list.name.toUpperCase();
    const subtitle = list.localeType.toUpperCase();

    // Titulo
    writer.writeText(title, PdfStyles.title.color, opts.songTitle.FontSize, {
      align: 'center',
    });

    // Subtitulo
    writer.writeText(
      subtitle,
      PdfStyles.source.color,
      opts.songSource.FontSize,
      {
        align: 'center',
      }
    );

    writer.doc.moveDown();
    // Posicion de reset para segunda columna
    writer.resetY = writer.doc.y;

    if (list.type === 'libre') {
      var cantos = list.items;
      cantos.forEach((canto, i) => {
        const lastX = writer.doc.x;
        writer.writeText(
          `${i + 1}.`,
          PdfStyles.normalLine.color,
          opts.songText.FontSize,
          {
            lineBreak: false,
            align: 'left',
          }
        );
        writer.doc.x += 10;
        writer.writeText(
          canto.titulo,
          PdfStyles.normalLine.color,
          opts.songText.FontSize,
          {
            align: 'left',
          }
        );
        writer.doc.x = lastX;
      });
    } else {
      const getTitleValue = (
        key: string,
        removeIfEmpty: boolean = false
      ): any => {
        if (list.hasOwnProperty(key)) {
          var valor = list[key];
          if (valor && getEsSalmo(key)) {
            valor = valor.titulo;
          }
          if (!valor && removeIfEmpty) {
            return null;
          }
          return { title: getLocalizedListItem(key), value: valor ?? '-' };
        }
        return null;
      };

      var items = [];
      const NEWLINE = 'NEWLINE';
      const NEWCOL = 'NEWCOL';
      items.push(getTitleValue('ambiental'));
      items.push(getTitleValue('entrada'));
      items.push(NEWLINE);
      items.push(getTitleValue('1-monicion'));
      items.push(getTitleValue('1'));
      items.push(getTitleValue('1-salmo'));
      items.push(NEWLINE);
      items.push(getTitleValue('2-monicion'));
      items.push(getTitleValue('2'));
      items.push(getTitleValue('2-salmo'));
      items.push(NEWLINE);
      items.push(getTitleValue('3-monicion'));
      items.push(getTitleValue('3'));
      items.push(getTitleValue('3-salmo'));
      items.push(NEWLINE);
      items.push(getTitleValue('evangelio-monicion'));
      items.push(getTitleValue('evangelio'));
      items.push(NEWLINE);
      items.push(getTitleValue('oracion-universal'));
      items.push(NEWLINE);
      items.push(getTitleValue('paz'));
      items.push(getTitleValue('comunion-pan'));
      items.push(getTitleValue('comunion-caliz'));
      items.push(getTitleValue('salida'));
      items.push(NEWCOL);
      items.push(getTitleValue('encargado-pan', true));
      items.push(getTitleValue('encargado-flores', true));
      items.push(getTitleValue('nota', true));

      var movedDown = false;
      items.forEach((item: any, i) => {
        // cuando el anterior es un NEWLINE, no moverse de nuevo!
        if (typeof item === 'string' && item === NEWLINE && !movedDown) {
          writer.doc.moveDown();
          movedDown = true;
        } else if (typeof item === 'string' && item === NEWCOL) {
          writer.startColumn();
          movedDown = false;
        } else if (item && item.title) {
          const lastX = writer.doc.x;
          writer.writeText(
            `${item.title}:`,
            PdfStyles.source.color,
            opts.songText.FontSize,
            {
              align: 'left',
            }
          );
          writer.doc.x += 20;
          writer.writeText(
            item.value,
            PdfStyles.normalLine.color,
            opts.songText.FontSize + 2,
            {
              align: 'left',
            }
          );
          writer.doc.x = lastX;
          movedDown = false;
        }
      });
      writer.writePageFooterText('iResucitó');
    }

    return await writer.save();
  } catch (err) {
    console.log('ListPDFGenerator ERROR', err);
  }
  return '';
};

export const getPatchStats = (patch: SongIndexPatch): any => {
  const stats = [];
  const allItems = [];
  Object.keys(patch).forEach((key) => {
    const songPatch = patch[key];
    Object.keys(songPatch).forEach((rawLoc) => {
      allItems.push({ locale: rawLoc, author: songPatch[rawLoc].author });
    });
  });
  const byLocale = _.groupBy(allItems, (i) => i.locale);
  Object.keys(byLocale).forEach((locale) => {
    const byAuthor = _.groupBy(byLocale[locale], (p) => p.author);
    const items = Object.keys(byAuthor).map((author) => {
      return { author, count: byAuthor[author].length };
    });
    stats.push({ locale, count: byLocale[locale].length, items });
  });
  return stats;
};
