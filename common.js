// @flow
// Utilerias comunes (no atadas a react-native ni a NodeJS)
const PDFDocument = require('./pdfkit.standalone.js');
import normalize from 'normalize-strings';
import langs from 'langs';
import I18n from './translations';

export const defaultExportToPdfOptions: ExportToPdfOptions = {
  useTimesRomanFont: false,
  marginLeft: 25,
  marginTop: 19,
  widthHeightPixels: 598, // 21,1 cm
  songTitle: { FontSize: 19 },
  songSource: { FontSize: 10 },
  songText: { FontSize: 12 },
  songNote: { FontSize: 10 },
  songIndicatorSpacing: 18,
  songParagraphSpacing: 9,
  indexTitle: { FontSize: 16 },
  bookTitle: { FontSize: 80, Spacing: 10 },
  bookSubtitle: { FontSize: 14 },
  indexText: { FontSize: 11 },
  indexMarginLeft: 25
};

export const cleanChordsRegex = /\[|\]|\(|\)|#|\*|5|6|7|9|b|-|\+|\/|\u2013|aum|dim|m|is|IS/g;

export const getChordsScale = (locale: string): Array<string> => {
  return I18n.t('chords.scale', { locale }).split(' ');
};

export const getPropertyLocale = (obj: any, rawLoc: string) => {
  if (obj.hasOwnProperty(rawLoc)) {
    return rawLoc;
  } else {
    const locale = rawLoc.split('-')[0];
    if (obj.hasOwnProperty(locale)) {
      return locale;
    }
  }
};

export const getLocalesForPicker = (
  defaultLocale: string
): Array<PickerLocale> => {
  var locales = [
    {
      label: `${I18n.t('ui.default')} (${defaultLocale})`,
      value: 'default'
    }
  ];
  for (var code in I18n.translations) {
    var l = langs.where('1', code.split('-')[0]);
    locales.push({ label: `${l.local} (${code})`, value: code });
  }
  return locales;
};

export const getValidatedLocale = (
  availableLocales: Array<PickerLocale>,
  locale: string
): ?PickerLocale => {
  const loc = locale.split('-')[0];
  const best = availableLocales.find(
    l => l.value === locale || l.value === loc
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
  var items: Array<ListSongItem> = songsToPdf.map(data => {
    const sameName = songsToPdf.filter(d => d.song.titulo === data.song.titulo);
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
  'election'
];

export const getGroupedByStage = (
  songsToPdf: Array<SongToPdf>
): ListSongGroup => {
  // Agrupados por stage
  return songsToPdf.reduce((groups, data) => {
    const groupKey = data.song.stage;
    groups[groupKey] = groups[groupKey] || [];
    const sameName = songsToPdf.filter(d => d.song.titulo === data.song.titulo);
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
  'pentecost'
];

export const getGroupedByLiturgicTime = (
  songsToPdf: Array<SongToPdf>
): ListSongGroup => {
  // Agrupados por tiempo liturgico
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicTimes.filter(t => data.song[t] === true);
    times.forEach(t => {
      groups[t] = groups[t] || [];
      const sameName = songsToPdf.filter(
        d => d.song.titulo === data.song.titulo
      );
      const title = sameName.length > 1 ? data.song.nombre : data.song.titulo;
      groups[t].push({ songKey: data.song.key, str: title });
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
): ListSongGroup => {
  // Agrupados por tiempo liturgico
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicOrder.filter(t => data.song[t] === true);
    times.forEach(t => {
      groups[t] = groups[t] || [];
      const sameName = songsToPdf.filter(
        d => d.song.titulo === data.song.titulo
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
  prefix: { color: '#777777' }
};

var DEBUG_RECTS = false;

export class PdfWriter {
  opts: ExportToPdfOptions;
  pageNumber: number;
  resetY: number;
  limiteHoja: number;
  doc: any;
  base64Transform: any;
  addExtraMargin: boolean;
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
          (this.addExtraMargin ? this.opts.indexMarginLeft : 0)
      },
      size: [this.opts.widthHeightPixels, this.opts.widthHeightPixels]
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
          this.doc.page.margins.top
      };
      this.pageNumberLimits = {
        x: this.limits.x,
        y:
          this.opts.widthHeightPixels -
          this.doc.page.margins.bottom -
          this.heightOfPageNumbers,
        w: this.limits.w,
        h: this.heightOfPageNumbers
      };
      this.firstColLimits = {
        x: this.limits.x,
        y: this.limits.y,
        w: this.limits.w / 2,
        h: this.limits.h
      };
      this.secondColLimits = {
        x: this.firstColLimits.x + this.firstColLimits.w,
        y: this.limits.y,
        w: this.firstColLimits.w,
        h: this.limits.h
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
      Author: 'iResucitó app ',
      Subject: 'iResucitó Song Book',
      Keywords: 'Neocatechumenal songs'
    };
    if (fontBuf) {
      this.doc.registerFont('thefont', fontBuf);
      this.doc.font('thefont');
    } else {
      this.doc.font('Times-Roman');
    }
    this.pageNumber = 1;
    this.listing = [];
    this.addExtraMargin = false;
  }

  writePageNumber(currentSongKey?: string) {
    this.doc.x = this.doc.page.margins.left;
    this.doc.y = this.pageNumberLimits.y;
    this.writeText(
      this.pageNumber.toString(),
      PdfStyles.pageNumber.color,
      this.opts.songText.FontSize,
      {
        lineBreak: false,
        align: 'center',
        width:
          this.opts.widthHeightPixels -
          this.doc.page.margins.left -
          this.doc.page.margins.right,
        height: this.heightOfPageNumbers
      }
    );
    if (currentSongKey) {
      const assignItems = this.listing.filter(
        l => l.songKey === currentSongKey
      );
      assignItems.forEach(i => {
        i.value = this.pageNumber;
      });
    }
    this.pageNumber++;
  }

  checkLimits(lineCount: number = 1, nextHeight: number = 0) {
    if (
      this.doc.y + this.doc.currentLineHeight(false) * lineCount + nextHeight >
      this.pageNumberLimits.y
    ) {
      if (this.doc.x == this.secondColLimits.x) {
        this.writePageNumber();
        this.doc.addPage();
      } else {
        this.doc.x = this.secondColLimits.x;
      }
      this.doc.y = this.resetY;
    }
  }

  startColumn() {
    if (this.doc.x !== this.secondColLimits.x) {
      this.doc.x = this.secondColLimits.x;
      this.doc.y = this.resetY;
    }
  }

  getCenteringY(text: string, size: number) {
    const height = this.doc.fontSize(size).heightOfString(text);
    return parseInt((this.opts.widthHeightPixels - height) / 2);
  }

  writeText(text: string, color: any, size: number, opts?: any): number {
    this.doc
      .fillColor(color)
      .fontSize(size)
      .text(text, opts);
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
        lineBreak: false
      });
  }

  async save() {
    return new Promise((resolve, reject) => {
      var stream = this.doc.pipe(this.base64Transform);
      var str = '';
      stream.on('error', err => {
        reject(err);
      });
      stream.on('data', data => {
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
              this.widthOfIndexSpacing
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
            page: this.pageNumber,
            songKey: item.songKey,
            x:
              this.doc.x < this.secondColLimits.x
                ? this.firstColLimits.x + this.firstColLimits.w
                : this.secondColLimits.x + this.secondColLimits.w,
            y: this.doc.y - this.doc.currentLineHeight(false),
            value: 0
          });
        }
      });
    }
  }

  finalizeListing() {
    if (this.listing.length > 0) {
      for (var i = 0; i < this.pageNumber; i++) {
        this.doc.switchToPage(i);
        var items = this.listing.filter(l => l.page === i);
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
              align: 'right'
            }
          );
        });
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
        locale: 'es'
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
        align: 'center'
      });

      // Subtitulo
      writer.writeText(
        subtitle,
        PdfStyles.normalLine.color,
        writer.opts.bookSubtitle.FontSize,
        {
          align: 'center'
        }
      );

      //Indice
      writer.doc.addPage();
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
      var items = getAlphaWithSeparators(songsToPdf);
      writer.generateListing(I18n.t('search_title.alpha'), items);

      writer.doc.moveDown();

      // Agrupados por stage
      var byStage = getGroupedByStage(songsToPdf);
      wayStages.forEach(stage => {
        writer.generateListing(I18n.t(`search_title.${stage}`), byStage[stage]);
        writer.doc.moveDown();
      });

      // Agrupados por tiempo liturgico
      var byTime = getGroupedByLiturgicTime(songsToPdf);
      liturgicTimes.forEach((time, i) => {
        var title = I18n.t(`search_title.${time}`);
        if (i === 0) {
          title = I18n.t('search_title.liturgical time') + ` - ${title}`;
        }
        writer.generateListing(title, byTime[time]);
        writer.doc.moveDown();
      });

      // Agrupados por orden liturgico
      var byOrder = getGroupedByLiturgicOrder(songsToPdf);
      liturgicOrder.forEach(order => {
        var title = I18n.t(`search_title.${order}`);
        writer.generateListing(title, byOrder[order]);
        writer.doc.moveDown();
      });

      writer.writePageNumber();
    }

    writer.addExtraMargin = false;
    // Cantos
    songsToPdf.forEach((data: SongToPdf) => {
      const { song, render } = data;
      const { items, indicators } = render;
      writer.doc.addPage();

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
        if (i > 0 && it.type == 'inicioParrafo') {
          writer.doc.moveDown();
        }
        if (i > 0 && it.type == 'tituloEspecial') {
          writer.doc.moveDown();
          writer.doc.moveDown();
        }
        if (indicators.find(r => r.start === i)) {
          blockIndicator = indicators.find(r => r.start === i);
          blockY = writer.doc.y;
        }
        if (blockIndicator && blockIndicator.end === i) {
          var text = '';
          var color = PdfStyles.indicator.color;
          if (blockIndicator.type == 'bloqueRepetir') {
            text = I18n.t('songs.repeat');
          } else if (blockIndicator.type == 'bloqueNotaAlPie') {
            text = '*';
          }
          lines.push({
            page: writer.pageNumber - 1,
            startY: blockY,
            endY: writer.doc.y - writer.doc.currentLineHeight(false),
            x: maxX + 10,
            text,
            color
          });
          blockIndicator = null;
          blockY = 0;
        }
        if (it.type == 'comenzarColumna') {
          writer.startColumn();
        }
        writer.checkLimits(it.type == 'notas' ? 2 : 1);
        if (it.type == 'notas') {
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.notesLine.color,
            writer.opts.songNote.FontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type == 'canto') {
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.normalLine.color,
            writer.opts.songText.FontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type == 'cantoConIndicador') {
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
        } else if (it.type == 'tituloEspecial') {
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.specialNoteTitle.color,
            writer.opts.songText.FontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type == 'textoEspecial') {
          lastWidth = writer.writeText(
            it.texto,
            PdfStyles.specialNote.color,
            writer.opts.songText.FontSize - 3,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.type == 'notaEspecial') {
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
        } else if (it.type == 'posicionAbrazadera') {
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
      if (songsToPdf.length > 1) {
        writer.writePageNumber(song.key);
      }
    });
    writer.finalizeListing();
    return await writer.save();
  } catch (err) {
    console.log('PDFGenerator ERROR', err);
  }
};
