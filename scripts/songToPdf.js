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

var primerColumnaX = pdfValues.marginLeftRight;
var segundaColumnaX = pdfValues.widthHeightPixels / 2 + primerColumnaX;
var primerFilaY = pdfValues.cantoFontSize + pdfValues.fuenteSpacing;
var limiteHoja = pdfValues.widthHeightPixels - pdfValues.marginTopBottom * 2;

var primerColumnaIndexX =
  pdfValues.marginLeftRight + pdfValues.indexExtraMarginLeftRight;
var segundaColumnaIndexX =
  pdfValues.widthHeightPixels / 2 + primerColumnaIndexX;

const docsDir = path.resolve(__dirname, '../pdf');

export const generateListing = async (
  doc: any,
  pos: ExportToPdfCoord,
  title: string,
  items: any,
  pageTitle?: string
) => {
  var resetY = primerFilaY;
  if (pageTitle) {
    doc
      .fillColor(NodeStyles.titulo.color)
      .fontSize(pdfValues.titleFontSize)
      .font('thefont')
      .text(pageTitle.toUpperCase(), {
        align: 'center'
      });
    pos.y += pdfValues.titleFontSize + pdfValues.indexSpacing;
    resetY = pos.y;
  }
  doc
    .fillColor(NodeStyles.titulo.color)
    .fontSize(pdfValues.fuenteFontSize)
    .font('thefont')
    .text(title.toUpperCase(), pos.x, pos.y);
  pos.y += pdfValues.indexSpacing;
  items.forEach(str => {
    if (str !== '') {
      doc
        .fillColor(NodeStyles.lineaNormal.color)
        .fontSize(pdfValues.fuenteFontSize)
        .font('thefont')
        .text(str, pos.x, pos.y, { lineBreak: false });
    }
    // No incrementar caso especial; linea vacia en primer fila de segunda columns
    if (
      !(pos.x === segundaColumnaIndexX && str === '' && pos.y === primerFilaY)
    ) {
      pos.y += pdfValues.indexSpacing;
    }
    if (pos.y >= limiteHoja) {
      if (pos.x == segundaColumnaIndexX) {
        doc.addPage();
        pos.x = primerColumnaIndexX;
        resetY = primerFilaY;
      } else {
        pos.x = segundaColumnaIndexX;
      }
      pos.y = resetY;
    }
  });
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
    size: [pdfValues.widthHeightPixels, pdfValues.widthHeightPixels],
    margins: {
      top: pdfValues.marginTopBottom,
      bottom: pdfValues.marginTopBottom,
      left: pdfValues.marginLeftRight,
      right: pdfValues.marginLeftRight
    }
  });
  var pageNumber = 0;
  doc.registerFont('thefont', 'assets/fonts/Franklin Gothic Medium.ttf');

  // Indice
  if (opts.createIndex) {
    doc.addPage();
    var coord = {
      y: primerFilaY,
      x: primerColumnaIndexX
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
      if (coord.y !== primerFilaY) {
        coord.y += pdfValues.indexSpacing;
      }
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
      if (coord.y !== primerFilaY) {
        coord.y += pdfValues.indexSpacing;
      }
      var title = I18n.t(`search_title.${time}`);
      if (i === 0) {
        title = I18n.t('search_title.liturgical time') + ` - ${title}`;
      }
      generateListing(doc, coord, title, byTime[time]);
    });
    // Agrupados por tiempo liturgico
    var byOrder = getGroupedByLiturgicOrder(songsToPdf);
    liturgicOrder.forEach(order => {
      if (coord.y !== primerFilaY) {
        coord.y += pdfValues.indexSpacing;
      }
      var title = I18n.t(`search_title.${order}`);
      generateListing(doc, coord, title, byOrder[order]);
    });
  }

  // Cantos
  await asyncForEach(songsToPdf, async data => {
    // Tomar canto y las lineas para renderizar
    const { canto, lines } = data;
    doc.addPage();
    pageNumber++;
    doc
      .fillColor(NodeStyles.titulo.color)
      .fontSize(pdfValues.titleFontSize)
      .font('thefont')
      .text(canto.titulo.toUpperCase(), {
        align: 'center'
      });
    doc
      .fillColor(NodeStyles.fuente.color)
      .fontSize(pdfValues.fuenteFontSize)
      .font('thefont')
      .text(canto.fuente, {
        align: 'center'
      });
    var y =
      pdfValues.titleFontSize +
      pdfValues.fuenteFontSize +
      pdfValues.fuenteSpacing;
    var x = primerColumnaX;
    var yStart = y + pdfValues.parrafoSpacing;
    lines.forEach((it: SongLine, idx) => {
      if (it.inicioParrafo) {
        y += pdfValues.parrafoSpacing;
      }
      if (it.tituloEspecial) {
        y += pdfValues.parrafoSpacing * 2;
      }
      var alturaExtra = 0;
      if (it.notas) {
        alturaExtra = pdfValues.cantoSpacing;
      }
      if (y + alturaExtra >= limiteHoja) {
        // Si ya estamos escribiendo en la 2da columna
        // el texto quedara sobreecrito, por tanto generar advertencia
        if (x === segundaColumnaX) {
          console.log(
            'Sin lugar (%s, linea %s = "%s"), página %s',
            canto.titulo,
            idx,
            it.texto,
            pageNumber
          );
        }
        x = segundaColumnaX;
        y = yStart;
      }
      if (it.notas === true) {
        doc
          .fillColor(NodeStyles.lineaNotas.color)
          .fontSize(pdfValues.notesFontSize)
          .font('thefont')
          .text(it.texto, x + pdfValues.indicadorSpacing, y + 1, {
            lineBreak: false
          });
        y += pdfValues.cantoSpacing;
      } else if (it.canto === true) {
        doc
          .fillColor(NodeStyles.lineaNormal.color)
          .fontSize(pdfValues.cantoFontSize)
          .font('thefont')
          .text(it.texto, x + pdfValues.indicadorSpacing, y, {
            lineBreak: false
          });
        y += pdfValues.cantoSpacing;
      } else if (it.cantoConIndicador === true) {
        doc
          .fillColor(NodeStyles.prefijo.color)
          .fontSize(pdfValues.cantoFontSize)
          .font('thefont')
          .text(it.prefijo, x, y, { lineBreak: false });
        if (it.tituloEspecial === true) {
          doc
            .fillColor(NodeStyles.lineaTituloNotaEspecial.color)
            .fontSize(pdfValues.cantoFontSize)
            .font('thefont')
            .text(it.texto, x + pdfValues.indicadorSpacing, y, {
              lineBreak: false
            });
        } else if (it.textoEspecial === true) {
          doc
            .fillColor(NodeStyles.lineaNotaEspecial.color)
            .fontSize(pdfValues.cantoFontSize - 3)
            .font('thefont')
            .text(it.texto, x + pdfValues.indicadorSpacing, y, {
              lineBreak: false
            });
        } else {
          doc
            .fillColor(NodeStyles.lineaNormal.color)
            .fontSize(pdfValues.cantoFontSize)
            .font('thefont')
            .text(it.texto, x + pdfValues.indicadorSpacing, y, {
              lineBreak: false
            });
        }
        y += pdfValues.cantoSpacing;
      }
    });

    if (opts.pageNumbers) {
      const pX =
        (pdfValues.widthHeightPixels - pdfValues.marginLeftRight * 2) / 2;
      const pY =
        pdfValues.widthHeightPixels -
        pdfValues.marginTopBottom -
        pdfValues.cantoFontSize;
      doc
        .fillColor(NodeStyles.lineaNormal.color)
        .fontSize(pdfValues.cantoFontSize)
        .font('thefont')
        .text(pageNumber, pX, pY, { lineBreak: false });
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
