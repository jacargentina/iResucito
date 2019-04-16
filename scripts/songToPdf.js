// @flow
import PDFDocument from 'pdfkit';
import { SongsProcessor } from '../src/SongsProcessor';
import fs from 'fs';
import path from 'path';
import osLocale from 'os-locale';
import I18n from '../src/translations';

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

export function generatePDF(canto: Song, lines: Array<SongLine>) {
  // Para centrar titulo
  var doc = new PDFDocument({
    size: [widthHeightPixels, widthHeightPixels],
    margins: {
      top: marginTopBottom,
      bottom: marginTopBottom,
      left: marginLeftRight,
      right: marginLeftRight
    }
  });
  doc.registerFont('thefont', 'assets/fonts/Franklin Gothic Medium.ttf');
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
  lines.forEach((it: SongLine) => {
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
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir);
  }
  const pdfPath = `${docsDir}/${canto.titulo}.pdf`;
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.end();
  console.log(`Created ${pdfPath}`);
}

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
            generatePDF(song, songlines);
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
        songs.forEach(song => {
          if (song.locale === I18n.locale) {
            console.log('Song: ', song.titulo);
            var songlines = folderSongs.getSongLinesForRender(
              song.lines,
              song.locale,
              0
            );
            if (program.debug) {
              console.log(songlines);
            }
            generatePDF(song, songlines);
          } else {
            console.log('Song not found for given locale');
          }
        });
      });
    }
  }
}
