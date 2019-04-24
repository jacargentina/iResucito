// @flow
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import osLocale from 'os-locale';
import normalize from 'normalize-strings';
import I18n from '../src/translations';
import { asyncForEach } from '../src/common';
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

var titleFontSize = 19;
var fuenteFontSize = 10;
var fuenteSpacing = 20;
var cantoFontSize = 12;
var cantoSpacing = 11;
var indicadorSpacing = 18;
var parrafoSpacing = 12;
var notesFontSize = 10;
var widthHeightPixels = 598; // 21,1 cm
var marginLeftRight = 15;
var marginTopBottom = 19;
var primerColumnaX = 15;
var segundaColumnaX = 315;

const docsDir = path.resolve(__dirname, '../pdf');

export const generatePDF = async (songsToPdf: Array<SongToPdf>) => {
  const pdfPath =
    songsToPdf.length === 1
      ? `${docsDir}/${songsToPdf[0].canto.titulo}.pdf`
      : `${docsDir}/iResucito.pdf`;
  const pdfPathNorm = normalize(pdfPath);
  // Para centrar titulo
  var doc = new PDFDocument({
    autoFirstPage: false,
    size: [widthHeightPixels, widthHeightPixels],
    margins: {
      top: marginTopBottom,
      bottom: marginTopBottom,
      left: marginLeftRight,
      right: marginLeftRight
    }
  });
  var pageNumber = 0;
  doc.registerFont('thefont', 'assets/fonts/Franklin Gothic Medium.ttf');
  await asyncForEach(songsToPdf, async data => {
    // Tomar canto y las lineas para renderizar
    const { canto, lines } = data;
    doc.addPage();
    pageNumber++;
    doc
      .fillColor(NodeStyles.titulo.color)
      .fontSize(titleFontSize)
      .font('thefont')
      .text(canto.titulo.toUpperCase(), {
        align: 'center'
      });
    doc
      .fillColor(NodeStyles.fuente.color)
      .fontSize(fuenteFontSize)
      .font('thefont')
      .text(canto.fuente, {
        align: 'center'
      });
    var y = titleFontSize + fuenteFontSize + fuenteSpacing;
    var x = primerColumnaX;
    var yStart = y + parrafoSpacing;
    lines.forEach((it: SongLine, idx) => {
      if (it.inicioParrafo) {
        y += parrafoSpacing;
      }
      if (it.tituloEspecial) {
        y += parrafoSpacing * 2;
      }
      var limiteHoja = widthHeightPixels - marginTopBottom * 2;
      var alturaExtra = 0;
      if (it.notas) {
        alturaExtra = cantoSpacing;
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
          .fontSize(notesFontSize)
          .font('thefont')
          .text(it.texto, x + indicadorSpacing, y + 1, { lineBreak: false });
        y += cantoSpacing;
      } else if (it.canto === true) {
        doc
          .fillColor(NodeStyles.lineaNormal.color)
          .fontSize(cantoFontSize)
          .font('thefont')
          .text(it.texto, x + indicadorSpacing, y, { lineBreak: false });
        y += cantoSpacing;
      } else if (it.cantoConIndicador === true) {
        doc
          .fillColor(NodeStyles.prefijo.color)
          .fontSize(cantoFontSize)
          .font('thefont')
          .text(it.prefijo, x, y, { lineBreak: false });
        if (it.tituloEspecial === true) {
          doc
            .fillColor(NodeStyles.lineaTituloNotaEspecial.color)
            .fontSize(cantoFontSize)
            .font('thefont')
            .text(it.texto, x + indicadorSpacing, y, { lineBreak: false });
        } else if (it.textoEspecial === true) {
          doc
            .fillColor(NodeStyles.lineaNotaEspecial.color)
            .fontSize(cantoFontSize - 3)
            .font('thefont')
            .text(it.texto, x + indicadorSpacing, y, { lineBreak: false });
        } else {
          doc
            .fillColor(NodeStyles.lineaNormal.color)
            .fontSize(cantoFontSize)
            .font('thefont')
            .text(it.texto, x + indicadorSpacing, y, { lineBreak: false });
        }
        y += cantoSpacing;
      }
    });
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
            generatePDF([item]);
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
        generatePDF(items);
      });
    }
  }
}
