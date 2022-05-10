import { folderSongs, readLocalePatch } from '~/utils.server';
import { json, LoaderFunction } from 'remix';
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
  const changes = folderSongs.getSongHistory(key, locale);
  let pending = null;

  const patch = await readLocalePatch();
  if (patch && patch[key] && patch[key][locale]) {
    const { author, date } = patch[key][locale];
    pending = { author, date };
  }

  const result: SongChangesAndPatches = { changes, pending };

  const etag = await import('etag');
  const headers = {
    'Cache-Control': 'max-age=0, must-revalidate',
    ETag: etag.default(JSON.stringify(result)),
  };

  if (request.headers.get('If-None-Match') === headers.ETag) {
    return new Response('', { status: 304, headers });
  }

  return json(result, { headers });
};
