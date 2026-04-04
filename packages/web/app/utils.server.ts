import {
  SongIndexPatch,
  SongSettingsFile,
  SongsProcessor,
  SongsExtras,
  loadAllLocales,
} from '@iresucito/core';
import { Low, Adapter } from 'lowdb';
import send from 'gmail-send';
import bcrypt from 'bcryptjs';
export { readFileSync } from 'fs';

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

// declare global {
//   var db: Low<DbType>;
//   var folderSongs: SongsProcessor;
//   var folderExtras: SongsExtras;
//   var mailSender: (...args: any[]) => Promise<void>;
// }

class FetchAdapter<T> implements Adapter<T> {
  file: string;
  private accessToken: string | null = null;
  private hasError: boolean = false;
  private readonly TIMEOUT_MS = 60000; // 60 segundos timeout

  constructor(file: string, accessToken: string | null = null) {
    this.file = file;
    this.accessToken = accessToken || null;
    if (!this.accessToken) {
      this.hasError = true;
      console.log('⚠️ FetchAdapter: DROPBOX_PASSWORD no definida');
    }
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit
  ): Promise<Response> {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (err: any) {
      console.error(`❌ Fetch falló: ${err.message}`);
      throw err;
    }
  }

  async read(): Promise<T | null> {
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 1) console.log(`🔄 Reintento ${attempt}/3 para ${this.file}`);
        const result = await this._readOnce();
        if (result !== null) {
          return result;
        }
      } catch (err: any) {
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    console.error(`❌ Fallaron todos los reintentos para ${this.file}`);
    return null;
  }

  private async _readOnce(): Promise<T | null> {
    if (this.hasError || !this.accessToken) {
      console.log('⚠️ FetchAdapter no disponible');
      return null;
    }

    try {
      const headers = {
        'Content-Type': 'text/plain',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${this.file.toLowerCase()}`,
        }),
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await this.fetchWithTimeout(
        'https://content.dropboxapi.com/2/files/download',
        {
          method: 'POST',
          headers,
        }
      );

      if (!response.ok) {
        console.error(`❌ Error HTTP ${response.status} para ${this.file}`);
        return null;
      }

      const content = await response.text();

      if (!content || content.trim().length === 0) {
        console.log(`⚠️ Contenido vacío: ${this.file}`);
        return null;
      }

      try {
        const parsed = JSON.parse(content) as T;
        return parsed;
      } catch (parseErr: any) {
        console.error(`❌ Error parseando JSON: ${this.file}`);
        return null;
      }
    } catch (err: any) {
      console.error(`❌ Error leyendo ${this.file}: ${err.message}`);
      throw err;
    }
  }

  async write(data: T): Promise<void> {
    if (this.hasError || !this.accessToken) {
      console.log('⚠️ FetchAdapter no disponible');
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path: `/${this.file}`,
          mode: { '.tag': 'overwrite' },
          autorename: false,
        }),
        Authorization: `Bearer ${this.accessToken}`,
      };

      const response = await this.fetchWithTimeout(
        'https://content.dropboxapi.com/2/files/upload',
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        console.error(`❌ Error subiendo ${this.file}: ${response.status}`);
        return;
      }

      console.log(`✅ Subido: ${this.file}`);
    } catch (err: any) {
      console.error(`❌ Error subiendo ${this.file}: ${err.message}`);
    }
  }
}

class WebSongsExtras implements SongsExtras {
  patch: Low<SongIndexPatch>;

  constructor(accessToken: string | null = null) {
    this.patch = new Low<SongIndexPatch>(
      new FetchAdapter('SongsIndexPatch.json', accessToken),
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

  saveSettings(ratings: SongSettingsFile): Promise<void> {
    return Promise.resolve();
  }

  deleteSettings(): Promise<void> {
    return Promise.resolve();
  }

  settingsExists(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

export const singleton = <Value>(
  name: string,
  valueFactory: () => Value
): Value => {
  const g = global as any;
  g.__singletons ??= {};
  g.__singletons[name] ??= valueFactory();
  return g.__singletons[name];
};

export const folderSongs = singleton(
  'songsprocessor',
  () => new SongsProcessor(loadAllLocales())
);

export const folderExtras = singleton(
  'websongsextras',
  () => new WebSongsExtras(process.env.DROPBOX_PASSWORD)
);

export const mailSender = singleton('mailsender', () =>
  send({
    user: 'javier.alejandro.castro@gmail.com',
    pass: process.env.GMAIL_PASSWORD,
    subject: 'iResucito Web',
  })
);

const defaultUser = {
  email: 'default@host',
  password: bcrypt.hashSync('1234', bcrypt.genSaltSync(10)),
  isVerified: true,
  createdAt: Date.now(),
};

export const db = singleton('db', () => {
  var db = new Low<DbType>(
    new FetchAdapter<DbType>('db.json', process.env.DROPBOX_PASSWORD),
    {
      users: [defaultUser],
      tokens: [],
    }
  );
  db.read();
  return db;
});
