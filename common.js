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
  songTitle: { FontSize: 19, Spacing: 19 },
  songSource: { FontSize: 10, Spacing: 20 },
  songText: { FontSize: 12, Spacing: 11 },
  songNote: { FontSize: 10 },
  songIndicatorSpacing: 18,
  songParagraphSpacing: 9,
  indexTitle: { FontSize: 16, Spacing: 14 },
  bookTitle: { FontSize: 80, Spacing: 10 },
  bookSubtitle: { FontSize: 14 },
  indexSubtitle: { FontSize: 12, Spacing: 4 },
  indexText: { FontSize: 11, Spacing: 3 },
  indexMarginLeft: 25
};

export const cleanChordsRegex = /\[|\]|\(|\)|#|\*|5|6|7|9|b|-|\+|\/|\u2013|\u2217|aum|dim|m|is|IS/g;

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

var DEBUG_RECTS = true;

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
      autoFirstPage: false
    });
    this.doc.on('pageAdding', e => {
      e.options.margins = {
        top: this.opts.marginTop,
        bottom: this.opts.marginTop,
        left:
          this.opts.marginLeft +
          (this.addExtraMargin ? this.opts.indexMarginLeft : 0),
        right:
          this.opts.marginLeft +
          (this.addExtraMargin ? this.opts.indexMarginLeft : 0)
      };
      e.options.size = [
        this.opts.widthHeightPixels,
        this.opts.widthHeightPixels
      ];
      this.resetY = this.opts.marginTop;
    });
    this.doc.on('pageAdded', () => {
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
          this.opts.songText.FontSize * 2,
        w: this.limits.w,
        h: this.opts.songText.FontSize * 2
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
    this.widthOfIndexPageNumbers = this.doc
      .fontSize(this.opts.indexText.FontSize)
      .widthOfString('000');
    this.widthOfIndexSpacing = this.doc
      .fontSize(this.opts.indexText.FontSize)
      .widthOfString('  ');
    this.pageNumber = 1;
    this.listing = [];
    this.addExtraMargin = false;
    this.resetY = this.opts.marginTop;
  }

  async writePageNumber(currentSongKey?: string) {
    this.doc.x = this.doc.page.margins.left;
    this.doc.y = this.pageNumberLimits.y + this.opts.songText.FontSize / 2;
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
          this.doc.page.margins.right
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

  async checkLimits() {
    if (
      this.doc.y + this.doc.currentLineHeight(false) >
      this.pageNumberLimits.y
    ) {
      if (this.doc.x == this.secondColLimits.x) {
        await this.writePageNumber();
        this.doc.addPage();
      } else {
        this.doc.x = this.secondColLimits.x;
      }
      this.doc.y = this.resetY;
    }
  }

  async getCenteringY(text: string, size: number) {
    const height = this.doc.fontSize(size).heightOfString(text);
    return parseInt((this.opts.widthHeightPixels - height) / 2);
  }

  async writeText(
    text: string,
    color: any,
    size: number,
    opts?: any
  ): Promise<number> {
    this.doc
      .fillColor(color)
      .fontSize(size)
      .text(text, opts);
    return (
      this.doc.fontSize(size).widthOfString(text) +
      (opts && opts.indent ? opts.indent : 0)
    );
  }

  async drawLineText(line: ExportToPdfLineText, size: number) {
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

  async generateListing(title: string, items: Array<ListSongItem>) {
    await this.checkLimits();
    await this.writeText(
      title.toUpperCase(),
      PdfStyles.title.color,
      this.opts.indexSubtitle.FontSize
    );
    if (items) {
      await asyncForEach(items, async (item: ListSongItem) => {
        if (item.str === '') {
          this.doc.moveDown();
        } else {
          await this.checkLimits();
          await this.writeText(
            item.str,
            PdfStyles.normalLine.color,
            this.opts.indexText.FontSize,
            {
              width:
                this.firstColLimits.w -
                this.widthOfIndexPageNumbers -
                this.widthOfIndexSpacing
            }
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

  async finalizeListing() {
    if (this.listing.length > 0) {
      for (var i = 0; i < this.pageNumber; i++) {
        this.doc.switchToPage(i);
        var items = this.listing.filter(l => l.page === i);
        await asyncForEach(items, async (l: ListSongPos) => {
          this.doc.x =
            l.x - this.widthOfIndexPageNumbers - this.widthOfIndexSpacing * 2;
          this.doc.y = l.y;
          await this.writeText(
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
      writer.doc.y = await writer.getCenteringY(
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
      await writer.writeText(
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
      await writer.generateListing(I18n.t('search_title.alpha'), items);

      writer.doc.moveDown();

      // Agrupados por stage
      var byStage = getGroupedByStage(songsToPdf);
      await asyncForEach(wayStages, async stage => {
        await writer.generateListing(
          I18n.t(`search_title.${stage}`),
          byStage[stage]
        );
        writer.doc.moveDown();
      });

      // Agrupados por tiempo liturgico
      var byTime = getGroupedByLiturgicTime(songsToPdf);
      await asyncForEach(liturgicTimes, async (time, i) => {
        var title = I18n.t(`search_title.${time}`);
        if (i === 0) {
          title = I18n.t('search_title.liturgical time') + ` - ${title}`;
        }
        await writer.generateListing(title, byTime[time]);
        writer.doc.moveDown();
      });

      // Agrupados por orden liturgico
      var byOrder = getGroupedByLiturgicOrder(songsToPdf);
      await asyncForEach(liturgicOrder, async order => {
        var title = I18n.t(`search_title.${order}`);
        await writer.generateListing(title, byOrder[order]);
        writer.doc.moveDown();
      });

      await writer.writePageNumber();
    }

    writer.addExtraMargin = false;
    // Cantos
    await asyncForEach(songsToPdf, async (data: SongToPdf) => {
      const { song, render } = data;
      const { items, indicators } = render;
      writer.doc.addPage();

      // Titulo del canto
      await writer.writeText(
        song.titulo.toUpperCase(),
        PdfStyles.title.color,
        writer.opts.songTitle.FontSize,
        { align: 'center' }
      );

      // Fuente
      await writer.writeText(
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
      await asyncForEach(items, async (it: SongLine, i: number) => {
        var lastWidth: number = 0;
        if (i > 0 && it.inicioParrafo) {
          writer.doc.moveDown();
        }
        if (i > 0 && it.tituloEspecial) {
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
          if (blockIndicator.type == 'repeat') {
            text = I18n.t('songs.repeat');
          } else if (blockIndicator.type == 'footnote') {
            text = '*';
          }
          lines.push({
            startY: blockY,
            endY: writer.doc.y,
            x: maxX + 10,
            text,
            color
          });
          blockIndicator = null;
          blockY = 0;
        }
        await writer.checkLimits();
        if (it.notas === true) {
          lastWidth = await writer.writeText(
            it.texto,
            PdfStyles.notesLine.color,
            writer.opts.songNote.FontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.canto === true) {
          lastWidth = await writer.writeText(
            it.texto,
            PdfStyles.normalLine.color,
            writer.opts.songText.FontSize,
            { indent: writer.opts.songIndicatorSpacing }
          );
        } else if (it.cantoConIndicador === true) {
          lastWidth = await writer.writeText(
            it.prefijo,
            PdfStyles.prefix.color,
            writer.opts.songText.FontSize
          );
          writer.doc.moveUp();
          if (it.tituloEspecial === true) {
            lastWidth = await writer.writeText(
              it.texto,
              PdfStyles.specialNoteTitle.color,
              writer.opts.songText.FontSize,
              { indent: writer.opts.songIndicatorSpacing }
            );
          } else if (it.textoEspecial === true) {
            lastWidth = await writer.writeText(
              it.texto,
              PdfStyles.specialNote.color,
              writer.opts.songText.FontSize - 3,
              { indent: writer.opts.songIndicatorSpacing }
            );
          } else {
            lastWidth = await writer.writeText(
              it.texto,
              PdfStyles.normalLine.color,
              writer.opts.songText.FontSize,
              { indent: writer.opts.songIndicatorSpacing }
            );
          }
        }
        maxX = Math.trunc(Math.max(writer.doc.x + lastWidth, maxX));
      });
      await asyncForEach(lines, async (line: ExportToPdfLineText) => {
        await writer.drawLineText(line, writer.opts.songText.FontSize);
      });
      if (songsToPdf.length > 1) {
        await writer.writePageNumber(song.key);
      }
    });
    await writer.finalizeListing();
    return await writer.save();
  } catch (err) {
    console.log('PDFGenerator ERROR', err);
  }
};
