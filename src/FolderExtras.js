// @flow
import fs from 'fs';
import { SongsExtras } from './SongsExtras';

const NodeReader = (path: string) => {
  return fs.promises.readFile(path, 'utf8');
};

const NodeWriter = (path: string, content: any, encoding: string) => {
  return fs.promises.writeFile(path, content, encoding);
};

const NodeExists = (path: string) => {
  return Promise.resolve(fs.existsSync(path));
};

const FolderExtras = new SongsExtras(
  './data',
  NodeExists,
  NodeWriter,
  NodeReader,
  fs.promises.unlink
);

export default FolderExtras;
