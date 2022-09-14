import * as path from 'path';
import * as fs from 'fs';
import { SongIndexPatch, SongsExtras, SongsProcessor } from '@iresucito/core';
// @ts-ignore
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

console.log('utils.server.ts __dirname', __dirname);

let folderExtras: SongsExtras = new SongsExtras(
  path.resolve(__dirname + '/../data'),
  NodeExists,
  NodeWriter,
  NodeReader,
  fs.promises.unlink
);

export const folderSongs = new SongsProcessor(
  path.resolve(__dirname + '/../public/songs'),
  NodeLister,
  NodeReader
);

let db: any = null;

export const getdb = async () => {
  if (!db) {
    // @ts-ignore
    const lowdb = await import('lowdb');
    const { LowSync, JSONFileSync } = lowdb;
    const dataPath = path.resolve(__dirname + '/../data');
    const dbPath = path.join(dataPath, 'db.json');
    console.log('getdb', dbPath);
    db = new LowSync(new JSONFileSync(dbPath));
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
