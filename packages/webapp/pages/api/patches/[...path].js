import { readLocalePatch } from '../../../common';
import FolderSongs from '../../../../../FolderSongs';

export default async function handler(req, res) {
  const { path } = req.query;
  const [key, locale] = path;
  if (!locale || !key) {
    return res.status(500).json({
      error: 'Locale or key not provided',
    });
  }

  FolderSongs.basePath = require('path').resolve('../../songs');
  const changes = FolderSongs.getSongHistory(key, locale);
  let pending = null;

  const patch = await readLocalePatch();
  if (patch && patch[key] && patch[key][locale]) {
    const { author, date } = patch[key][locale];
    pending = { author, date };
  }

  res.json({ changes, pending });
}
