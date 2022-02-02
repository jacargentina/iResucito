import * as Diff from 'diff';
import { readLocalePatch } from '~/utils';
import { getPropertyLocale } from '~/common';
import SongsIndex from '~/songs/index.json';
import FolderSongs from '~/FolderSongs';

export default async function handler(req, res) {
  const { path } = req.query;
  const [key, locale] = path;
  if (!locale || !key) {
    return res.status(500).json({
      error: 'Locale or key not provided',
    });
  }

  const patch = await readLocalePatch();
  if (patch && patch[key] && patch[key][locale]) {
    if (SongsIndex.hasOwnProperty(key)) {
      const loc = getPropertyLocale(SongsIndex[key].files, locale);
      let fullText = '';
      if (loc) {
        const filename = SongsIndex[key].files[loc];
        FolderSongs.basePath = require('path').resolve('../../songs');
        fullText = await FolderSongs.loadLocaleSongFile(loc, filename);
      }
      const diff = Diff.diffLines(fullText, patch[key][locale].lines);
      res.json({ diff });
    }
  } else {
    res.json({ diff: null });
  }
}
