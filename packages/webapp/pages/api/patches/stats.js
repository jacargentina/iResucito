import { readLocalePatch } from '../../../common';
import { getPatchStats } from '../../../../../common';

export default async function handler(req, res) {
  const patch = await readLocalePatch();
  const stats = patch ? getPatchStats(patch) : [];
  res.json(stats);
}
