import * as path from 'path';
import * as fs from 'fs';
import { SongsExtras } from '~/SongsExtras';
import { SongsProcessor } from '~/SongsProcessor';
import send from 'gmail-send';

const NodeReader = (path: string) => {
  return fs.promises.readFile(path, 'utf8');
};

const NodeWriter = (path: string, content: any, encoding: BufferEncoding) => {
  return fs.promises.writeFile(path, content, encoding);
};

const NodeExists = (path: string) => {
  return Promise.resolve(fs.existsSync(path));
};

const NodeLister = async (path: string) => {
  const files = await fs.promises.readdir(path);
  return files.map((file) => {
    return { name: file };
  });
};

let folderExtras: SongsExtras = new SongsExtras(
  './data',
  NodeExists,
  NodeWriter,
  NodeReader,
  fs.promises.unlink
);

export const folderSongs = new SongsProcessor(
  '../songs',
  NodeLister,
  NodeReader
);

let db: any = null;

export const dataPath: string = path.resolve('./data');

export const getdb = async () => {
  if (!db) {
    const lowdb = await import('lowdb');
    const { LowSync, JSONFileSync } = lowdb;
    db = new LowSync(new JSONFileSync(path.join(dataPath, 'db.json')));
    db.data = db.data || { users: [], tokens: [] };
  }
  return db;
};

export async function readLocalePatch(): Promise<any> {
  const exists = await folderExtras.patchExists();
  if (exists) {
    const patchJSON = await folderExtras.readPatch();
    return JSON.parse(patchJSON);
  }
}

export async function saveLocalePatch(patchObj: SongIndexPatch | undefined) {
  const json = JSON.stringify(patchObj, null, ' ');
  await folderExtras.savePatch(json);
}

export const mailSender = send({
  user: 'javier.alejandro.castro@gmail.com',
  pass: process.env.GMAIL_PASSWORD,
  subject: 'iResucito Web',
});
