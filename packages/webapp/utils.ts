import * as path from 'path';
import { LowSync, JSONFileSync } from 'lowdb';
import FolderExtras from '../../FolderExtras';

export const dataPath: string = path.resolve('./data');
export const db: any = new LowSync(
  new JSONFileSync(path.join(dataPath, 'db.json'))
);
db.data = db.data || { users: [], tokens: [] };

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
