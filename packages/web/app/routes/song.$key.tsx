import { readLocalePatch, saveLocalePatch } from '~/utils.server';
import '~/utils.server';
import { authenticator } from '~/auth.server';
import { ActionFunction, json, LoaderFunction } from '@remix-run/node';
import { getSession } from '~/session.server';
import { Song, SongPatch, SongPatchData } from '@iresucito/core';

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

  if (patch.name) {
    patch.name = patch.name.trim();
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
  const songs = globalThis.folderSongs.getSongsMeta(locale, patchObj);
  const song = songs.find((s) => s.key === key) as Song;
  await globalThis.folderSongs.loadSingleSong(locale, song, patchObj);

  return { ok: true, song };
};

const addNewSong = async (locale: string, session: AuthData) => {
  let patchObj = await readLocalePatch();
  if (!patchObj) {
    patchObj = {};
  }

  const songs = globalThis.folderSongs.getSongsMeta(locale, patchObj);

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
  const newSongs = globalThis.folderSongs.getSongsMeta(locale, patchObj);
  const newSong = newSongs.find((s) => s.key === newKey) as Song;
  await globalThis.folderSongs.loadSingleSong(locale, newSong, patchObj);

  return { ok: true, song: newSong };
};

export let loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const locale = session.get('locale') as string;
  if (!locale) {
    throw new Error('Locale not provided');
  }
  const { key } = params;
  if (!key) {
    throw new Error('key not provided');
  }
  const authData = await authenticator.isAuthenticated(request);
  if (!authData) {
    throw new Error("Can't continue. Login required for that action");
  }
  if (key === 'newSong') {
    return json(await addNewSong(locale, authData));
  }
};

export let action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const locale = session.get('locale') as string;
  if (!locale) {
    throw new Error('Locale not provided');
  }
  try {
    const authData = await authenticator.isAuthenticated(request);
    if (!authData) {
      throw new Error("Can't continue. Login required for that action");
    }
    const { key } = params;
    if (!key) {
      throw new Error('key not provided');
    }
    if (request.method === 'DELETE') {
      return json(await del(key, locale));
    } else if (request.method === 'POST') {
      return json(await post(key, locale, authData, request));
    } else {
      return new Response(null, { status: 404 });
    }
  } catch (err: any) {
    console.log(err);
    return json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
};
