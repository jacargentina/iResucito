// @flow
import * as path from 'path';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import FolderExtras from '../../FolderExtras';

export const dataPath = path.resolve('./web/data');
export const db = low(new FileSync(path.join(dataPath, 'db.json')));
db.defaults({ users: [], tokens: [] }).write();

export const asyncMiddleware = (fn: Function) => (
  req: any,
  res: any,
  next: any
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export async function readLocalePatch(): ?SongIndexPatch {
  const exists = await FolderExtras.patchExists();
  if (exists) {
    const patchJSON = await FolderExtras.readPatch();
    return JSON.parse(patchJSON);
  }
}

export async function saveLocalePatch(patchObj: ?SongIndexPatch) {
  var json = JSON.stringify(patchObj, null, ' ');
  await FolderExtras.savePatch(json);
}
