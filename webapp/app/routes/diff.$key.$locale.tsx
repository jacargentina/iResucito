import * as Diff from 'diff';
import { folderSongs, readLocalePatch } from '~/utils.server';
import { getPropertyLocale } from '~/common';
import SongsIndex from '~/songs/index.json';
import { json, LoaderFunction } from 'remix';

export let loader: LoaderFunction = async ({ request, params }) => {
  const { key, locale } = params;
  if (!key) {
    throw new Error('key not provided');
  }
  if (!locale) {
    throw new Error('locale not provided');
  }
  const patch = await readLocalePatch();
  if (patch && patch[key] && patch[key][locale]) {
    if (SongsIndex.hasOwnProperty(key)) {
      const loc = getPropertyLocale(SongsIndex[key].files, locale);
      let fullText = '';
      if (loc) {
        const filename = SongsIndex[key].files[loc];
        fullText = await folderSongs.loadLocaleSongFile(loc, filename);
      }
      const diff = Diff.diffLines(fullText, patch[key][locale].lines);
      return json({ diff });
    }
  } else {
    return json({ diff: null });
  }
};
