import * as path from 'path';
import FolderExtras from '~/FolderExtras';

let db: any = null;

export const dataPath: string = path.resolve('./data');
export const getdb = async () => {
  if (!db) {
    const lowdb = await import('lowdb');
    const { LowSync, JSONFileSync } = lowdb.default;
    db = new LowSync(new JSONFileSync(path.join(dataPath, 'db.json')));
    db.data = db.data || { users: [], tokens: [] };
  }
  return db;
};

export async function readLocalePatch(): Promise<any> {
  const exists = await FolderExtras.patchExists();
  if (exists) {
    const patchJSON = await FolderExtras.readPatch();
    return JSON.parse(patchJSON);
  }
}

export async function saveLocalePatch(patchObj: SongIndexPatch | undefined) {
  const json = JSON.stringify(patchObj, null, ' ');
  await FolderExtras.savePatch(json);
}
