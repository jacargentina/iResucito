import { readLocalePatch, saveLocalePatch } from '~/utils.server';
import { folderSongs } from '~/utils.server';
import { authenticator } from '~/auth.server';
import { ActionFunction, json } from 'remix';

const merge = require('deepmerge');

const del = async (key: string, locale: string) => {
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

const post = async (
  key: string,
  locale: string,
  session: AuthData,
  request: Request
) => {
  let patchObj = await readLocalePatch();

  const body = await request.json();

  const patch: SongPatchData = {
    author: session.user,
    date: Date.now(),
    ...body,
  };
  if (!patchObj) {
    patchObj = {};
  }

  if (patch.rename) {
    patch.rename = patch.rename.trim();
  }

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
  const songs = folderSongs.getSongsMeta(locale, patchObj);
  const song = songs.find((s) => s.key === key);
  await folderSongs.loadSingleSong(locale, song, patchObj);

  return { ok: true, song };
};

const addNewSong = async (locale: string, session: AuthData) => {
  let patchObj = await readLocalePatch();
  if (!patchObj) {
    patchObj = {};
  }

  const songs = folderSongs.getSongsMeta(locale, patchObj);

  // Crear song
  const patch: SongPatchData = {
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
  const newSongs = folderSongs.getSongsMeta(locale, patchObj);
  const newSong = newSongs.find((s) => s.key === newKey);
  await folderSongs.loadSingleSong(locale, newSong, patchObj);

  return { ok: true, song: newSong };
};

export let action: ActionFunction = async ({ request, params }) => {
  const session = await authenticator.isAuthenticated(request);
  try {
    if (!session) {
      throw new Error('Cant continue. Login required for that action');
    }
    const { key, locale } = params;
    if (!key) {
      throw new Error('key not provided');
    }
    if (!locale) {
      throw new Error('locale not provided');
    }
    if (request.method === 'DELETE') {
      return json(await del(key, locale));
    } else if (request.method === 'POST') {
      return json(await post(key, locale, session, request));
    } else if (request.method === 'GET' && key === 'newSong') {
      return json(await addNewSong(locale, session));
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (err) {
    console.log(err);
    return json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
};
