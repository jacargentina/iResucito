// @flow
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import osLocale from 'os-locale';
import normalize from 'normalize-strings';
import I18n from '../src/translations';
import {
  asyncForEach,
  getAlphaWithSeparators,
  wayStages,
  getGroupedByStage,
  liturgicTimes,
  getGroupedByLiturgicTime,
  liturgicOrder,
  getGroupedByLiturgicOrder,
  pdfValues
} from '../src/common';
import { SongsProcessor } from '../src/SongsProcessor';

const NodeLister = fs.promises.readdir;

const NodeReader = (path: string) => {
  return fs.promises.readFile(path, { encoding: 'utf8' });
};

const NodeStyles: SongStyles = {
  titulo: { color: '#ff0000' },
  fuente: { color: '#777777' },
  lineaNotas: { color: '#ff0000' },
  lineaTituloNotaEspecial: { color: '#ff0000' },
  lineaNotaEspecial: { color: '#444444' },
  lineaNotasConMargen: { color: '#ff0000' },
  lineaNormal: { color: '#000000' },
  prefijo: { color: '#777777' }
};

const folderSongs = new SongsProcessor(
  path.resolve(__dirname, '../songs'),
  NodeLister,
  NodeReader,
  NodeStyles
);

var primerFilaY = pdfValues.marginTop;
var limiteHoja = pdfValues.widthHeightPixels - pdfValues.marginTop * 2;
var pageNumber = 1;

const docsDir = path.resolve(__dirname, '../pdf');

export const writePageNumber = (doc: any) => {
  doc
    .fillColor(NodeStyles.lineaNormal.color)
    .fontSize(pdfValues.songText.FontSize)
    .font('thefont')
    .text(pageNumber, pdfValues.widthHeightPixels / 2, limiteHoja, {
      lineBreak: false
    });
};

export const generateListing = async (
  doc: any,
  pos: ExportToPdfCoord,
  title: string,
  items: any,
  pageTitle?: string
) => {
  var resetY = primerFilaY;

  const checkLimits = (height: number) => {
    if (pos.y + height >= limiteHoja) {
      if (pos.x == pdfValues.segundaColumnaIndexX) {
        writePageNumber(doc);
        doc.addPage();
        pageNumber++;
        pos.x = pdfValues.primerColumnaIndexX;
        resetY = primerFilaY;
      } else {
        pos.x = pdfValues.segundaColumnaIndexX;
      }
      pos.y = resetY;
    }
  };

  if (pageTitle) {
    const height = pdfValues.indexTitle.FontSize + pdfValues.indexTitle.Spacing;
    checkLimits(height);
    const width = doc
      .fontSize(pdfValues.indexTitle.FontSize)
      .font('thefont')
      .widthOfString(pageTitle.toUpperCase());
    const titleX = parseInt((pdfValues.widthHeightPixels - width) / 2);
    doc
      .fillColor(NodeStyles.titulo.color)
      .fontSize(pdfValues.indexTitle.FontSize)
      .font('thefont')
      .text(pageTitle.toUpperCase(), titleX, pos.y, { lineBreak: false });
    pos.y += height;
    resetY = pos.y;
  }
  const height =
    pdfValues.indexSubtitle.FontSize + pdfValues.indexSubtitle.Spacing;
  checkLimits(height);
  doc
    .fillColor(NodeStyles.titulo.color)
    .fontSize(pdfValues.indexSubtitle.FontSize)
    .font('thefont')
    .text(title.toUpperCase(), pos.x, pos.y, { lineBreak: false });
  pos.y += height;
  const itemHeight = pdfValues.indexText.FontSize + pdfValues.indexText.Spacing;
  items.forEach(str => {
    if (str !== '') {
      checkLimits(itemHeight);
      doc
        .fillColor(NodeStyles.lineaNormal.color)
        .fontSize(pdfValues.indexText.FontSize)
        .font('thefont')
        .text(str, pos.x, pos.y, { lineBreak: false });
    }
    pos.y += itemHeight;
  });
  if (pos.y !== primerFilaY) {
    pos.y += itemHeight;
  }
};

export const generatePDF = async (
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions
) => {
  const pdfPath =
    songsToPdf.length === 1
      ? `${docsDir}/${songsToPdf[0].canto.titulo}.pdf`
      : `${docsDir}/iResucito.pdf`;
  const pdfPathNorm = normalize(pdfPath);
  // Para centrar titulo
  var doc = new PDFDocument({
    bufferPages: true,
    autoFirstPage: false,
    size: [pdfValues.widthHeightPixels, pdfValues.widthHeightPixels]
  });
  doc.registerFont('thefont', 'assets/fonts/Franklin Gothic Medium.ttf');
  pageNumber = 1;
  // Indice
  if (opts.createIndex) {
    doc.addPage();
    var coord = {
      y: primerFilaY,
      x: pdfValues.primerColumnaIndexX
    };
    // Alfabetico
    var items = getAlphaWithSeparators(songsToPdf);
    generateListing(
      doc,
      coord,
      I18n.t('search_title.alpha'),
      items,
      I18n.t('ui.export.songs index')
    );
    // Agrupados por etapa
    var byStage = getGroupedByStage(songsToPdf);
    wayStages.forEach(stage => {
      generateListing(
        doc,
        coord,
        I18n.t(`search_title.${stage}`),
        byStage[stage]
      );
    });
    // Agrupados por tiempo liturgico
    var byTime = getGroupedByLiturgicTime(songsToPdf);
    liturgicTimes.forEach((time, i) => {
      var title = I18n.t(`search_title.${time}`);
      if (i === 0) {
        title = I18n.t('search_title.liturgical time') + ` - ${title}`;
      }
      generateListing(doc, coord, title, byTime[time]);
    });
    // Agrupados por tiempo liturgico
    var byOrder = getGroupedByLiturgicOrder(songsToPdf);
    liturgicOrder.forEach(order => {
      var title = I18n.t(`search_title.${order}`);
      generateListing(doc, coord, title, byOrder[order]);
      writePageNumber(doc);
    });
  }

  // Cantos
  await asyncForEach(songsToPdf, async data => {
    // Tomar canto y las lineas para renderizar
    const { canto, lines } = data;
    doc.addPage();
    pageNumber++;
    var coord = {
      y: primerFilaY,
      x: 0
    };
    const width = doc
      .fontSize(pdfValues.songTitle.FontSize)
      .font('thefont')
      .widthOfString(canto.titulo.toUpperCase());
    coord.x = parseInt((pdfValues.widthHeightPixels - width) / 2);
    doc
      .fillColor(NodeStyles.titulo.color)
      .fontSize(pdfValues.songTitle.FontSize)
      .font('thefont')
      .text(canto.titulo.toUpperCase(), coord.x, coord.y);
    coord.y += pdfValues.songTitle.FontSize;
    const widthF = doc
      .fontSize(pdfValues.songSource.FontSize)
      .font('thefont')
      .widthOfString(canto.fuente);
    coord.x = parseInt((pdfValues.widthHeightPixels - widthF) / 2);
    doc
      .fillColor(NodeStyles.fuente.color)
      .fontSize(pdfValues.songSource.FontSize)
      .font('thefont')
      .text(canto.fuente, coord.x, coord.y);
    coord.y += pdfValues.songSource.FontSize;
    coord.x = pdfValues.primerColumnaX;
    var yStart = coord.y + pdfValues.songParagraphSpacing;
    lines.forEach((it: SongLine, idx) => {
      if (it.inicioParrafo) {
        coord.y += pdfValues.songParagraphSpacing;
      }
      if (it.tituloEspecial) {
        coord.y += pdfValues.songParagraphSpacing * 2;
      }
      var alturaExtra = 0;
      if (it.notas) {
        alturaExtra = pdfValues.songNote.FontSize + pdfValues.songText.Spacing;
      }
      if (coord.y + alturaExtra >= limiteHoja) {
        // Si ya estamos escribiendo en la 2da columna
        // el texto quedara sobreecrito, por tanto generar advertencia
        if (coord.x === pdfValues.segundaColumnaX) {
          console.log(
            'Sin lugar (%s, linea %s = "%s"), página %s',
            canto.titulo,
            idx,
            it.texto,
            pageNumber
          );
        }
        coord.x = pdfValues.segundaColumnaX;
        coord.y = yStart;
      }
      if (it.notas === true) {
        doc
          .fillColor(NodeStyles.lineaNotas.color)
          .fontSize(pdfValues.songNote.FontSize)
          .font('thefont')
          .text(it.texto, coord.x + pdfValues.songIndicatorSpacing, coord.y, {
            lineBreak: false
          });
        coord.y += pdfValues.songText.Spacing;
      } else if (it.canto === true) {
        doc
          .fillColor(NodeStyles.lineaNormal.color)
          .fontSize(pdfValues.songText.FontSize)
          .font('thefont')
          .text(it.texto, coord.x + pdfValues.songIndicatorSpacing, coord.y, {
            lineBreak: false
          });
        coord.y += pdfValues.songText.Spacing;
      } else if (it.cantoConIndicador === true) {
        doc
          .fillColor(NodeStyles.prefijo.color)
          .fontSize(pdfValues.songText.FontSize)
          .font('thefont')
          .text(it.prefijo, coord.x, coord.y, { lineBreak: false });
        if (it.tituloEspecial === true) {
          doc
            .fillColor(NodeStyles.lineaTituloNotaEspecial.color)
            .fontSize(pdfValues.songText.FontSize)
            .font('thefont')
            .text(it.texto, coord.x + pdfValues.songIndicatorSpacing, coord.y, {
              lineBreak: false
            });
        } else if (it.textoEspecial === true) {
          doc
            .fillColor(NodeStyles.lineaNotaEspecial.color)
            .fontSize(pdfValues.songText.FontSize - 3)
            .font('thefont')
            .text(it.texto, coord.x + pdfValues.songIndicatorSpacing, coord.y, {
              lineBreak: false
            });
        } else {
          doc
            .fillColor(NodeStyles.lineaNormal.color)
            .fontSize(pdfValues.songText.FontSize)
            .font('thefont')
            .text(it.texto, coord.x + pdfValues.songIndicatorSpacing, coord.y, {
              lineBreak: false
            });
        }
        coord.y += pdfValues.songText.Spacing;
      }
    });

    if (opts.pageNumbers) {
      writePageNumber(doc);
    }
  });
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }
  doc.pipe(fs.createWriteStream(pdfPathNorm));
  doc.end();
  console.log(`Created ${pdfPathNorm}`);
};

var program = require('commander');

program
  .version('1.0')
  .description('Generate PDF for a given song')
  .option(
    '-l, --locale [locale]',
    'Locale to use. Defaults to current OS locale'
  )
  .option(
    '-k, --key [value]',
    'Song key. Defaults to generate all songs',
    parseInt
  )
  .option('-D, --debug', 'Show debugging data (only development)');

if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
  var locale = program.locale;
  if (!locale) {
    locale = osLocale.sync();
    console.log('Locale: detected', locale);
  }
  I18n.locale = locale;
  console.log('Configured locale', I18n.locale);
  var key = program.key;
  var opts = { createIndex: true, pageNumbers: true };
  if (locale !== '') {
    if (key) {
      var song = folderSongs.getSingleSongMeta(key, locale);
      if (song.locale === I18n.locale) {
        folderSongs
          .loadSingleSong(song)
          .then(() => {
            console.log('Song: ', song.titulo);
            var songlines = folderSongs.getSongLinesForRender(
              song.lines,
              song.locale,
              0
            );
            if (program.debug) {
              console.log(songlines);
            }
            const item: SongToPdf = {
              canto: song,
              lines: songlines
            };
            generatePDF([item], opts);
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log('Song not found for given locale');
      }
    } else {
      var songs = folderSongs.getSongsMeta(locale);
      console.log(`No key Song. Generating ${songs.length} songs`);
      Promise.all(folderSongs.loadSongs(songs)).then(() => {
        var items = [];
        songs.map(song => {
          if (song.locale === I18n.locale) {
            var songlines = folderSongs.getSongLinesForRender(
              song.lines,
              song.locale,
              0
            );
            if (program.debug) {
              console.log(songlines);
            }
            const item: SongToPdf = {
              canto: song,
              lines: songlines
            };
            items.push(item);
          } else {
            console.log(
              `Song ${song.titulo} not found for given locale ${locale}`
            );
          }
        });
        generatePDF(items, opts);
      });
    }
  }
}
