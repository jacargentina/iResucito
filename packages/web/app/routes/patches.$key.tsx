import etag from 'etag';
import { json, LoaderFunction } from '@remix-run/node';
import { getSession } from '~/session.server';
import { SongChangesAndPatches } from '@iresucito/core';

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
  const changes = globalThis.folderSongs.getSongHistory(key, locale);
  let pending = null;

  const patch = await globalThis.folderExtras.readPatch();
  if (patch && patch[key] && patch[key][locale]) {
    const { author, date } = patch[key][locale];
    pending = { author, date };
  }

  const result: SongChangesAndPatches = { changes, pending };

  const headers = {
    'Cache-Control': 'max-age=0, must-revalidate',
    ETag: etag(JSON.stringify(result)),
  };

  if (request.headers.get('If-None-Match') === headers.ETag) {
    return new Response('', { status: 304, headers });
  }

  return json(result, { headers });
};
