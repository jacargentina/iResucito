import { folderSongs, readLocalePatch } from '~/utils.server';
import { json, LoaderFunction } from 'remix';

export let loader: LoaderFunction = async ({ params }) => {
  const { key, locale } = params;
  if (!key) {
    throw new Error('key not provided');
  }
  if (!locale) {
    throw new Error('locale not provided');
  }
  const changes = folderSongs.getSongHistory(key, locale);
  let pending = null;

  const patch = await readLocalePatch();
  if (patch && patch[key] && patch[key][locale]) {
    const { author, date } = patch[key][locale];
    pending = { author, date };
  }

  return json({ changes, pending });
};
