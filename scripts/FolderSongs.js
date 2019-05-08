// @flow
import fs from 'fs';
import path from 'path';
import { SongsProcessor } from '../src/SongsProcessor';

const NodeLister = path => {
  return fs.promises.readdir(path).then(files => {
    return files.map(file => {
      return { name: file };
    });
  });
};

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
  pageNumber: { color: '#000000' },
  prefijo: { color: '#777777' }
};

const FolderSongs = new SongsProcessor(
  path.resolve(__dirname, '../songs'),
  NodeLister,
  NodeReader,
  NodeStyles
);

export { NodeStyles, FolderSongs };
