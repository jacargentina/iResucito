import * as Diff from 'diff';
import etag from 'etag';
import { readLocalePatch } from '~/utils.server';
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

  const patch = await readLocalePatch();
  if (patch && patch[key] && patch[key][locale]) {
    if (SongsIndex.hasOwnProperty(key)) {
      const loc = getPropertyLocale(SongsIndex[key].files, locale);
      let fullText = '';
      if (loc) {
        const filename = SongsIndex[key].files[loc];
        fullText = await globalThis.folderSongs.loadLocaleSongFile(
          loc,
          filename
        );
      }
      result.diff = Diff.diffLines(fullText, patch[key][locale].lines);
    }
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
