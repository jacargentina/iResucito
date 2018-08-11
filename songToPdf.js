// @flow
import PDFDocument from 'pdfkit';
import { SongsProcessor } from './SongsProcessor';
import fs from 'fs';

const NodeLister = fs.promises.readdir;

const NodeReader = (path: string) => {
  return fs.promises.readFile(path, { encoding: 'utf8' });
};

const NodeStyles: SongStyles = {
  titulo: null,
  fuente: null,
  lineaNotas: null,
  lineaTituloNotaEspecial: null,
  lineaNotaEspecial: null,
  lineaNotasConMargen: null,
  lineaNormal: null,
  prefijo: null
};

const folderSongs = new SongsProcessor(
  './songs',
  NodeLister,
  NodeReader,
  NodeStyles
);

var titleFontSize = 19;
var titleSpacing = 11;
var fuenteFontSize = 10;
var fuenteSpacing = 20;
var cantoFontSize = 12;
var cantoSpacing = 11;
var fontName = 'Franklin Gothic Medium';
var indicadorSpacing = 18;
var parrafoSpacing = 6;
var notesFontSize = 10;
var widthHeightPixels = 598; // 21,1 cm
var primerColumnaX = 30;
var segundaColumnaX = 330;

const docsDir = './pdfs/';

export function generatePDF(canto: Song, lines: Array<SongLine>) {
  // Para centrar titulo
  var doc = new PDFDocument();
  doc.registerFont('thefont', 'assets/fonts/Franklin Gothic Medium.ttf');
  doc.fontSize(titleFontSize);
  doc.font('thefont').text(canto.titulo.toUpperCase(), {
    width: 410,
    align: 'center'
  });
  const pdfPath = `${docsDir}${canto.titulo}.pdf`;
  doc.pipe(fs.createWriteStream(pdfPath));
  doc.end();
  /*
  // Para centrar fuente
  return PDFLib.measureText(canto.fuente, fontName, fuenteFontSize)
    .then(sizeFuente => {
      var y = 560;
      var x = primerColumnaX;
      const page1 = PDFPage.create().setMediaBox(
        widthHeightPixels,
        widthHeightPixels
      );
      var titleX = parseInt((widthHeightPixels - sizeTitle.width) / 2);
      page1.drawText(canto.titulo.toUpperCase(), {
        x: titleX,
        y: y,
        color: stylesObj.titulo.color,
        fontSize: titleFontSize,
        fontName: fontName
      });
      y -= titleSpacing;
      var fuenteX = parseInt((widthHeightPixels - sizeFuente.width) / 2);
      page1.drawText(canto.fuente, {
        x: fuenteX,
        y: y,
        color: stylesObj.lineaNormal.color,
        fontSize: fuenteFontSize,
        fontName: fontName
      });
      y -= fuenteSpacing;
      var yStart = y;
      lines.forEach((it: SongLine, index) => {
        // Mantener los bloques siempre juntos
        // Los bloques se indican con inicioParrafo == true
        // Solo si estamos en la primer columna, calculamos si puede
        // pintarse por completo el bloque sin cortes; caso contrario
        // generamos la 2da columna
        // Si es el primer bloque de todos, no tenerlo en cuenta: hay cantos
        // cuyo primer bloque es muy largo (ej. "Adónde te escondiste amado"
        //  y en este caso hay que cortarlo forzosamente
        if (it.inicioParrafo && y !== yStart && x === primerColumnaX) {
          // console.log('Inicio de Parrafo:', it.texto);
          if (y < 0) {
            x = segundaColumnaX;
            y = yStart;
          } else {
            var alturaParrafo = 0;
            var textoParrafo = '';
            var i = index; // loop de i
            while (i < lines.length) {
              textoParrafo += `${lines[i].texto}\n`;
              alturaParrafo += cantoSpacing;
              i += 1;
              if (i < lines.length && lines[i].inicioParrafo) {
                break;
              }
            }
            // console.log(
            //   'Texto del bloque: %s, y: %s, alturaParrafo: %s, diferencia: %s',
            //   textoParrafo,
            //   y,
            //   alturaParrafo,
            //   y - alturaParrafo
            // );
            if (y - alturaParrafo <= 21) {
              x = segundaColumnaX;
              y = yStart;
            }
          }
        }
        if (it.inicioParrafo) {
          y -= parrafoSpacing;
        }
        if (it.tituloEspecial) {
          y -= parrafoSpacing * 2;
        }
        if (it.notas === true) {
          page1.drawText(it.texto, {
            x: x + indicadorSpacing,
            y: y,
            color: stylesObj.lineaNotas.color,
            fontSize: notesFontSize,
            fontName: fontName
          });
          y -= cantoSpacing;
        } else if (it.canto === true) {
          page1.drawText(it.texto, {
            x: x + indicadorSpacing,
            y: y,
            color: stylesObj.lineaNormal.color,
            fontSize: cantoFontSize,
            fontName: fontName
          });
          y -= cantoSpacing;
        } else if (it.cantoConIndicador === true) {
          page1.drawText(it.prefijo, {
            x: x,
            y: y,
            color: stylesObj.prefijo.color,
            fontSize: cantoFontSize,
            fontName: fontName
          });
          if (it.tituloEspecial === true) {
            page1.drawText(it.texto, {
              x: x + indicadorSpacing,
              y: y,
              color: stylesObj.lineaTituloNotaEspecial.color,
              fontSize: cantoFontSize,
              fontName: fontName
            });
          } else if (it.textoEspecial === true) {
            page1.drawText(it.texto, {
              x: x + indicadorSpacing,
              y: y,
              color: stylesObj.lineaNotaEspecial.color,
              fontSize: cantoFontSize - 3,
              fontName: fontName
            });
          } else {
            page1.drawText(it.texto, {
              x: x + indicadorSpacing,
              y: y,
              color: stylesObj.lineaNormal.color,
              fontSize: cantoFontSize,
              fontName: fontName
            });
          }
          y -= cantoSpacing;
        }
        // else {
        //   console.log('Sin dibujar en', y, JSON.stringify(it));
        // }
      });
      const docsDir =
        Platform.OS == 'ios'
          ? RNFS.TemporaryDirectoryPath
          : RNFS.CachesDirectoryPath + '/';
      const pdfPath = `${docsDir}${canto.titulo}.pdf`;
      return PDFDocument.create(pdfPath)
        .addPages(page1)
        .write();
    })
    .catch(err => {
      console.log('ERROR Measures', err);
    });
    */
}

if (process.argv.length == 4) {
  var locale = process.argv[2];
  var key = process.argv[3];
  if (key !== '' && locale !== '') {
    var song = folderSongs.getSingleSongMeta(key, locale);
    folderSongs.loadSingleSong(song).then(() => {
      console.log('Loaded song: %o', song);
      var songlines = folderSongs.preprocesarCanto(song.lines, 0);
      generatePDF(song, songlines);
    });
  }
} else {
  console.log('node songToPdf [locale] [songKey]');
}
