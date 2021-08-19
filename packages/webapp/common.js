// @flow
import * as path from 'path';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import FolderExtras from '../../FolderExtras';

export const dataPath: string = path.resolve('./data');
export const db: any = low(new FileSync(path.join(dataPath, 'db.json')));
db.defaults({ users: [], tokens: [] }).write();

export async function readLocalePatch(): any {
  const exists = await FolderExtras.patchExists();
  if (exists) {
    const patchJSON = await FolderExtras.readPatch();
    return JSON.parse(patchJSON);
  }
}

export async function saveLocalePatch(patchObj: ?SongIndexPatch) {
  const json = JSON.stringify(patchObj, null, ' ');
  await FolderExtras.savePatch(json);
}
