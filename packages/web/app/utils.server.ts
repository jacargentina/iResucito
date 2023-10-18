import { Dropbox } from 'dropbox';
import {
  SongIndexPatch,
  SongsExtras,
  SongsProcessor,
  loadAllLocales,
} from '@iresucito/core';
import { Low, Adapter } from 'lowdb';
import send from 'gmail-send';

type DbType = {
  users: Array<{
    email: string;
    createdAt: number;
    loggedInAt?: number;
    isVerified: boolean;
    password: string;
  }>;
  tokens: Array<{ email: string; token: string }>;
};

declare global {
  var db: Low<DbType>;
  var folderSongs: SongsProcessor;
  var folderExtras: SongsExtras;
  var mailSender: (...args: any[]) => Promise<void>;
}

class DropboxJsonFile<T> implements Adapter<T> {
  file: string;
  dropbox: Dropbox;

  constructor(file: string) {
    if (!process.env.DROPBOX_PASSWORD)
      throw new Error(
        'DROPBOX_PASSWORD no definida. No se puede conectar con Dropbox'
      );
    this.dropbox = new Dropbox({
      accessToken: process.env.DROPBOX_PASSWORD,
    });
    this.file = file;
  }

  async read(): Promise<T | null> {
    try {
      console.log('Descargando', this.file);
      const download = await this.dropbox.filesDownload({
        path: `/${this.file.toLowerCase()}`,
      });
      const meta = download.result;
      const data = (meta as any).fileBinary.toString();
      if (data == null) {
        return null;
      } else {
        return JSON.parse(data) as T;
      }
    } catch (err: any) {
      console.log('Error', err);
    }
    return null;
  }

  async write(data: T): Promise<void> {
    console.log('Subiendo', this.file);
    const response = await this.dropbox.filesUpload({
      path: `/${this.file}`,
      mode: { '.tag': 'overwrite' },
      contents: JSON.stringify(data, null, 2),
    });
    const meta = response.result;
    console.log(`Subido contenido ${meta.name}`);
  }
}

class WebSongsExtras implements SongsExtras {
  patch: Low<SongIndexPatch>;

  constructor() {
    this.patch = new Low<SongIndexPatch>(
      new DropboxJsonFile('SongsIndexPatch.json'),
      {}
    );
  }

  async readPatch(): Promise<SongIndexPatch> {
    await this.patch.read();
    return this.patch.data as SongIndexPatch;
  }

  async savePatch(patch: SongIndexPatch): Promise<void> {
    this.patch.data = patch;
    await this.patch.write();
  }

  async deletePatch(): Promise<void> {
    this.patch.data = {};
    await this.patch.write();
  }

  readSettings(): Promise<string> {
    return Promise.resolve('');
  }

  saveSettings(ratings: any): Promise<void> {
    return Promise.resolve(ratings);
  }

  deleteSettings(): Promise<void> {
    return Promise.resolve();
  }

  settingsExists(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

if (globalThis.folderSongs === undefined) {
  globalThis.folderSongs = new SongsProcessor(loadAllLocales());
}

if (globalThis.folderExtras === undefined) {
  globalThis.folderExtras = new WebSongsExtras();
}

if (globalThis.mailSender === undefined) {
  globalThis.mailSender = send({
    user: 'javier.alejandro.castro@gmail.com',
    pass: process.env.GMAIL_PASSWORD,
    subject: 'iResucito Web',
  });
}

const setupDb = async () => {
  if (globalThis.db === undefined) {
    try {
      var db = new Low<DbType>(new DropboxJsonFile('db.json'), {
        users: [],
        tokens: [],
      });
      await db.read();
      if (db.data == null) {
        // @ts-ignore
        db.data ||= { users: [], tokens: [] };
        await db.write();
      }
      globalThis.db = db;
    } catch (err: any) {
      console.log('Error', err.message);
    }
  }
};

setupDb();
