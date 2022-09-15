import * as path from 'path';
import * as fs from 'fs';
import { Dropbox } from 'dropbox';
import chokidar from 'chokidar';
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
  var watcher: chokidar.FSWatcher;
}

const dataPath = path.resolve(__dirname + '/../data');

if (globalThis.db === undefined) {
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
    dataPath,
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

const getDbx = () => {
  if (!process.env.DROPBOX_PASSWORD) {
    console.log(
      'DROPBOX_PASSWORD no definida. No se puede conectar con Dropbox'
    );
  } else {
    return new Dropbox({
      accessToken: process.env.DROPBOX_PASSWORD,
    });
  }
};

export const download = async (): Promise<boolean> => {
  const dbx = getDbx();
  if (!dbx) {
    return false;
  }
  console.log('Descargando', dataPath);
  const response = await dbx.filesListFolder({ path: '' });
  const files = response.result;
  if (files.entries.length) {
    console.log(`Descargando ${files.entries.length} archivos...`);
  }
  try {
    await Promise.all(
      files.entries.map((entry) => {
        if (entry.path_lower) {
          dbx.filesDownload({ path: entry.path_lower }).then((response_1) => {
            const meta = response_1.result;
            console.log(`Guardando ${meta.name}`);
            return fs.promises.writeFile(
              path.join(dataPath, meta.name),
              (meta as any).fileBinary
            );
          });
        }
      })
    );
    console.log('Listo.');
  } catch (err: any) {
    console.log('Error', err);
  }
  return true;
};

export const upload = async (file: string): Promise<boolean> => {
  const dbx = getDbx();
  if (!dbx) {
    return false;
  }
  const fullpath = path.isAbsolute(file) ? file : path.join(dataPath, file);
  const baseName = path.basename(fullpath);
  console.log('Subiendo', fullpath);
  try {
    const response = await dbx.filesUpload({
      path: `/${baseName}`,
      mode: { '.tag': 'overwrite' },
      contents: fs.readFileSync(fullpath),
    });
    const meta = response.result;
    console.log(`Subido ${meta.name}`);
  } catch (err: any) {
    console.log('Error', err);
  }
  return true;
};

const setup = async () => {
  if (globalThis.watcher === undefined) {
    const ok = await download();
    if (ok === true) {
      globalThis.watcher = chokidar
        .watch(dataPath, {
          persistent: true,
          ignoreInitial: true,
        })
        .on('add', (p) => upload(p))
        .on('change', (p) => upload(p));

      console.log('Observando para sincronizar', dataPath);
    }
  }
};

setup();
