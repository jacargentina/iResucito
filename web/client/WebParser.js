// @flow
import { SongsParser } from '../../src/SongsParser';

const FontSizes = {
  Notas: '10pt',
  Texto: '12pt',
  Titulo: '19pt',
  Fuente: '10pt'
};

export const WebStyles: SongStyles = {
  titulo: { color: '#ff0000', fontSize: FontSizes.Titulo },
  fuente: { color: '#777777', fontSize: FontSizes.Fuente, marginBottom: 16 },
  lineaNotas: { color: '#ff0000', fontSize: FontSizes.Notas },
  lineaTituloNotaEspecial: { color: '#ff0000', fontSize: FontSizes.Texto },
  lineaNotaEspecial: { color: '#444444', fontSize: FontSizes.Texto },
  lineaNotasConMargen: { color: '#ff0000', fontSize: FontSizes.Notas },
  lineaNormal: { color: '#000000', fontSize: FontSizes.Texto },
  pageNumber: { color: '#000000' },
  prefijo: { color: '#777777', fontSize: FontSizes.Texto }
};

export const WebParser = new SongsParser(WebStyles);
