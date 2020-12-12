import * as _ from 'lodash';
import { readLocalePatch } from '../../../common';

export default async function handler(req, res) {
  const stats = [];
  const patch = await readLocalePatch();
  if (patch) {
    const allItems = [];
    Object.keys(patch).forEach((key) => {
      const songPatch = patch[key];
      Object.keys(songPatch).forEach((rawLoc) => {
        allItems.push({ locale: rawLoc, author: songPatch[rawLoc].author });
      });
    });
    const byLocale = _.groupBy(allItems, (i) => i.locale);
    Object.keys(byLocale).forEach((locale) => {
      const byAuthor = _.groupBy(byLocale[locale], (p) => p.author);
      const items = Object.keys(byAuthor).map((author) => {
        return { author, count: byAuthor[author].length };
      });
      stats.push({ locale, count: byLocale[locale].length, items });
    });
  }
  res.json(stats);
}
