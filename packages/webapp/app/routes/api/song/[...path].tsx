import { readLocalePatch, saveLocalePatch } from '~/utils';
import FolderSongs from '~/FolderSongs';
import { authenticator } from '~/auth.server';

const merge = require('deepmerge');

const del = async (key, locale) => {
  let patchObj = await readLocalePatch();
  if (!patchObj) {
    patchObj = {};
  }
  if (!Object.prototype.hasOwnProperty.call(patchObj[key], locale)) {
    throw new Error(`Cant delete. Patch for locale ${locale} not found`);
  }
  delete patchObj[key][locale];

  if (Object.keys(patchObj[key]).length === 0) {
    delete patchObj[key];
  }

  await saveLocalePatch(patchObj);

  return { ok: true };
};

const post = async (key, locale, session, body) => {
  let patchObj = await readLocalePatch();

  const patch: SongPatchData = body;
  if (!patchObj) {
    patchObj = {};
  }

  if (patch.rename) {
    patch.rename = patch.rename.trim();
  }

  patch.author = session.user;
  patch.date = Date.now();

  const localePatch: SongPatch = {
    [locale]: patch,
  };
  if (!patchObj[key]) {
    patchObj[key] = {};
  }
  const updatedPatch = merge(patchObj[key], localePatch);
  patchObj[key] = updatedPatch;

  await saveLocalePatch(patchObj);

  // Recargar song y devolver
  FolderSongs.basePath = require('path').resolve('../../songs');
  const songs = FolderSongs.getSongsMeta(locale, patchObj);
  const song = songs.find((s) => s.key === key);
  await FolderSongs.loadSingleSong(locale, song, patchObj);

  return { ok: true, song };
};

const addNewSong = async (locale, session) => {
  let patchObj = await readLocalePatch();
  if (!patchObj) {
    patchObj = {};
  }

  FolderSongs.basePath = require('path').resolve('../../songs');
  const songs = FolderSongs.getSongsMeta(locale, patchObj);

  // Crear song
  const patch = {
    author: session.user,
    date: Date.now(),
    name: 'Title - Source',
    lines: 'Song text here',
    stage: 'precatechumenate',
  };
  const song: SongPatch = {
    [locale]: patch,
  };
  const songMaxKey = songs.reduce((prev, next) => {
    if (Number(prev.key) > Number(next.key)) {
      return prev;
    }
    return next;
  }, songs[0]);

  const newKey = String(Number(songMaxKey.key) + 1);
  patchObj[newKey] = song;
  await saveLocalePatch(patchObj);

  // Cargar y devolver
  const newSongs = FolderSongs.getSongsMeta(locale, patchObj);
  const newSong = newSongs.find((s) => s.key === newKey);
  await FolderSongs.loadSingleSong(locale, newSong, patchObj);

  return { ok: true, song: newSong };
};

export default async function handler(req, res) {
  const session = await authenticator.isAuthenticated(req);
  try {
    if (!session) {
      throw new Error('Cant continue. Login required for that action');
    }
    const { path } = req.query;
    const [key, locale] = path;
    if (req.method === 'DELETE') {
      res.json(await del(key, locale));
    } else if (req.method === 'POST') {
      res.json(await post(key, locale, session, req.body));
    } else if (req.method === 'GET' && key === 'newSong') {
      res.json(await addNewSong(locale, session));
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err.message,
    });
  }
}
