// @flow
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import normalize from 'normalize-strings';
import { pdfValues, PdfWriter, PDFGenerator } from '../common';

export const NodeStyles: SongStyles = {
  titulo: { color: '#ff0000' },
  fuente: { color: '#777777' },
  lineaClamp: { color: '#ff0000' },
  lineaRepeat: { color: '#ff0000' },
  lineaNotas: { color: '#ff0000' },
  lineaTituloNotaEspecial: { color: '#ff0000' },
  lineaNotaEspecial: { color: '#444444' },
  lineaNotasConMargen: { color: '#ff0000' },
  lineaNormal: { color: '#000000' },
  pageNumber: { color: '#000000' },
  prefijo: { color: '#777777' }
};

class NodeJsPdfWriter extends PdfWriter {
  doc: any;
  path: string;

  constructor(pdfPath: string) {
    super(
      pdfValues.widthHeightPixels - pdfValues.marginTop * 2,
      pdfValues.marginTop,
      NodeStyles.pageNumber.color,
      NodeStyles.titulo.color,
      NodeStyles.lineaNormal.color,
      NodeStyles.fuente.color,
      NodeStyles.lineaNotas.color,
      NodeStyles.prefijo.color,
      NodeStyles.lineaTituloNotaEspecial.color,
      NodeStyles.lineaNotaEspecial.color,
      NodeStyles.lineaRepeat.color
    );
    this.path = normalize(pdfPath);
    this.doc = new PDFDocument({
      bufferPages: true,
      autoFirstPage: false,
      size: [pdfValues.widthHeightPixels, pdfValues.widthHeightPixels]
    });
    this.doc.registerFont('thefont', 'assets/fonts/Franklin Gothic Medium.ttf');
  }

  checkLimitsCore(height: number) {
    return this.pos.y + height >= this.limiteHoja;
  }

  createPage() {
    this.doc.addPage();
  }

  addPageToDocument() {}

  moveToNextLine(height: number) {
    this.pos.y += height;
  }

  setNewColumnY(height: number) {
    this.resetY = this.pos.y + height;
  }

  async getCenteringX(text: string, font: string, size: number) {
    const width = this.doc
      .fontSize(size)
      .font('thefont')
      .widthOfString(text);
    return parseInt((pdfValues.widthHeightPixels - width) / 2);
  }

  async getCenteringY(text: string, font: string, size: number) {
    const height = this.doc
      .fontSize(size)
      .font('thefont')
      .heightOfString(text);
    return parseInt((pdfValues.widthHeightPixels - height) / 2);
  }

  async writeTextCore(
    text: string,
    color: any,
    font: string,
    size: number,
    xOffset?: number
  ): Promise<number> {
    const x = xOffset ? this.pos.x + xOffset : this.pos.x;
    this.doc
      .fillColor(color)
      .fontSize(size)
      .font('thefont')
      .text(text, x, this.pos.y, {
        lineBreak: false
      });
    return (
      this.doc
        .fontSize(size)
        .font('thefont')
        .widthOfString(text) + x
    );
  }

  async drawLineText(line: ExportToPdfLineText, font: string, size: number) {
    this.doc
      .moveTo(line.x, line.startY)
      .lineTo(line.x, line.endY)
      .stroke(line.color);
    const middle = (line.endY - line.startY) / 2;
    this.doc
      .fillColor(line.color)
      .fontSize(size)
      .font('thefont')
      .text(line.text, line.x + 10, line.startY + middle - size, {
        lineBreak: false
      });
  }

  async save() {
    return new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(this.path);
      stream.on('error', err => {
        reject(err);
      });
      stream.on('finish', () => {
        resolve(this.path);
      });
      this.doc.pipe(stream);
      this.doc.end();
    });
  }
}

export async function generatePDF(
  songsToPdf: Array<SongToPdf>,
  opts: ExportToPdfOptions,
  folder: string
) {
  const pdfPath = opts.createIndex
    ? `${folder}/iResucito${opts.fileSuffix}.pdf`
    : `${folder}/${songsToPdf[0].song.titulo}.pdf`;

  var writer = new NodeJsPdfWriter(pdfPath);

  return await PDFGenerator(songsToPdf, opts, writer);
}
