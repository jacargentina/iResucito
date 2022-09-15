import * as path from 'path';
import * as fs from 'fs';
import { SongIndexPatch, SongsExtras, SongsProcessor } from '@iresucito/core';
import { LowSync, JSONFileSync } from 'lowdb';
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

declare global {
  var db: any;
  var folderSongs: SongsProcessor;
  var folderExtras: SongsExtras;
  var mailSender: (...args: any[]) => Promise<void>;
}

if (globalThis.db === undefined) {
  const dataPath = path.resolve(__dirname + '/../data');
  const dbPath = path.join(dataPath, 'db.json');
  var db = new LowSync(new JSONFileSync(dbPath));
  db.read();
  // @ts-ignore
  db.data ||= { users: [], tokens: [] };
  db.write();
  globalThis.db = db;
}

if (globalThis.folderSongs === undefined) {
  globalThis.folderSongs = new SongsProcessor(
    path.resolve(__dirname + '/../public/songs'),
    NodeLister,
    NodeReader
  );
}

if (globalThis.folderExtras === undefined) {
  globalThis.folderExtras = new SongsExtras(
    path.resolve(__dirname + '/../data'),
    NodeExists,
    NodeWriter,
    NodeReader,
    fs.promises.unlink
  );
}

if (globalThis.mailSender === undefined) {
  globalThis.mailSender = send({
    user: 'javier.alejandro.castro@gmail.com',
    pass: process.env.GMAIL_PASSWORD,
    subject: 'iResucito Web',
  });
}

export async function readLocalePatch(): Promise<any> {
  const exists = await globalThis.folderExtras.patchExists();
  if (exists) {
    const patchJSON = await globalThis.folderExtras.readPatch();
    return JSON.parse(patchJSON);
  }
}

export async function saveLocalePatch(patchObj: SongIndexPatch | undefined) {
  const json = JSON.stringify(patchObj, null, ' ');
  await globalThis.folderExtras.savePatch(json);
}
