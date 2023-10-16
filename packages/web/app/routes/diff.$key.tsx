import * as Diff from 'diff';
import etag from 'etag';
import { getPropertyLocale } from '@iresucito/core';
import { SongsIndex } from '@iresucito/core';
import { json, LoaderFunction } from '@remix-run/node';
import { getSession } from '~/session.server';

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

  let result: { diff: Diff.Change[] | null } = { diff: null };

  const patch = await globalThis.folderExtras.readPatch();
  if (patch && patch.hasOwnProperty(key) && SongsIndex.hasOwnProperty(key)) {
    const loc = getPropertyLocale(SongsIndex[key].files, locale);
    let fullText = '';
    if (loc) {
      const songs = await globalThis.folderSongs.getSongsMeta(loc, patch);
      const song = songs.find((s) => s.key === key);
      if (!song) {
        throw new Error(`Song ${key} not valid`);
      }

      await globalThis.folderSongs.loadSingleSong(locale, song, patch);
      fullText = song.fullText;
    }
    const ploc = getPropertyLocale(patch[key], locale);
    result.diff = Diff.diffLines(fullText, patch[key][ploc].lines as string);
  }

  const headers = {
    'Cache-Control': 'max-age=0, must-revalidate',
    ETag: etag(JSON.stringify(result)),
  };

  if (request.headers.get('If-None-Match') === headers.ETag) {
    return new Response('', { status: 304, headers });
  }

  return json(result, { headers });
};
