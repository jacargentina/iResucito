// @flow
import * as path from 'path';
import FolderSongs from '../../FolderSongs';
import FolderExtras from '../../FolderExtras';
import { dataPath, readLocalePatch, saveLocalePatch } from './common';
const merge = require('deepmerge');

FolderSongs.basePath = path.resolve('./songs');
FolderExtras.basePath = dataPath;

export default function(server: any) {
  server.get('/api/list/:locale', async (req, res) => {
    const patch = await readLocalePatch();
    const { locale } = req.params;
    if (!locale) {
      return res.status(500).json({
        error: 'Locale not provided'
      });
    }
    var songs = FolderSongs.getSongsMeta(locale, patch);
    var localeSongs = await FolderSongs.readLocaleSongs(locale);
    var missingOnIndex = localeSongs.filter(locSong => {
      return !songs.find(s => s.files[locale] === locSong.nombre);
    });

    missingOnIndex.map(m => {
      var item = {
        stage: 'precatechumenate',
        files: {
          [locale]: m.nombre
        }
      };
      console.log(item);
    });

    res.json(songs);
  });

  server.get('/api/song/:key/:locale', async (req, res) => {
    const { key, locale } = req.params;
    if (!locale || !key) {
      return res.status(500).json({
        error: 'Locale or key not provided'
      });
    }
    const patch = await readLocalePatch();
    const songs = FolderSongs.getSongsMeta(locale, patch);
    const song = songs.find(s => s.key === key);
    if (!song)
      return res.status(500).json({
        error: `Song ${key} not valid`
      });

    await FolderSongs.loadSingleSong(locale, song, patch);
    if (song.error) {
      return res.status(500).json({
        error: song.error
      });
    } else {
      res.json(song);
    }
  });

  server.get('/api/patches/:key/:locale', async (req, res) => {
    const { key, locale } = req.params;
    if (!locale || !key) {
      return res.status(500).json({
        error: 'Locale or key not provided'
      });
    }

    var changes = FolderSongs.getSongHistory(key, locale);
    var pending = null;

    const patch = await readLocalePatch();
    if (patch && patch[key] && patch[key][locale]) {
      const { author, date } = patch[key][locale];
      pending = { author, date };
    }

    res.json({ changes, pending });
  });

  server.get('/api/song/newKey', async (req, res) => {
    const patch = await readLocalePatch();
    const songs = FolderSongs.getSongsMeta('es', patch);
    const songMaxKey = songs.reduce((prev, next) => {
      if (Number(prev.key) > Number(next.key)) {
        return prev;
      }
      return next;
    }, songs[0]);
    const newKey = Number(songMaxKey.key) + 1;
    res.json({ key: newKey });
  });

  server.delete('/api/song/:key/:locale', async (req, res) => {
    const { key, locale } = req.params;
    if (!locale || !key) {
      return res.status(500).json({
        error: 'Locale or key not provided'
      });
    }
    var patchObj = await readLocalePatch();

    if (!patchObj) patchObj = {};
    if (!patchObj[key].hasOwnProperty(locale)) {
      return res.status(500).json({
        error: `Cant delete. Patch for locale ${locale} not found`
      });
    }
    delete patchObj[key][locale];

    await saveLocalePatch(patchObj);
    console.log('Borrado patch', key);
    res.json({ ok: true });
  });

  server.post('/api/song/:key/:locale', async (req, res) => {
    const { key, locale } = req.params;
    if (!locale || !key) {
      return res.status(500).json({
        error: 'Locale or key not provided'
      });
    }
    var patchObj = await readLocalePatch();

    const patch: SongPatchData = req.body;
    if (!patchObj) patchObj = {};

    if (patch.rename) {
      patch.rename = patch.rename.trim();
    }

    patch.author = req.user.email;
    patch.date = Date.now();

    const localePatch: SongPatch = {
      [locale]: patch
    };
    if (!patchObj[key]) {
      patchObj[key] = {};
    }
    var updatedPatch = merge(patchObj[key], localePatch);
    patchObj[key] = updatedPatch;

    await saveLocalePatch(patchObj);
    res.json({ ok: true });
  });
}
