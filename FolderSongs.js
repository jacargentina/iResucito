// @flow
import fs from 'fs';
import { SongsProcessor } from './SongsProcessor';

const NodeLister = (path) => {
  return fs.promises.readdir(path).then((files) => {
    return files.map((file) => {
      return { name: file };
    });
  });
};

const NodeReader = (path: string) => {
  return fs.promises.readFile(path, { encoding: 'utf8' });
};

const FolderSongs: SongsProcessor = new SongsProcessor(
  './songs',
  NodeLister,
  NodeReader
);

export default FolderSongs;
