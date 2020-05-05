// @flow
import * as path from 'path';
import FolderSongs from '../../FolderSongs';
import FolderExtras from '../../FolderExtras';
import { SongsParser } from '../../SongsParser';
import { generatePDF } from '../../scripts/pdf';
import { PdfStyles, defaultExportToPdfOptions } from '../../common';
import I18n from '../../translations';
import {
  dataPath,
  readLocalePatch,
  saveLocalePatch,
  asyncMiddleware,
} from './common';

const merge = require('deepmerge');

FolderSongs.basePath = path.resolve('./songs');
FolderExtras.basePath = dataPath;

export default function (server: any) {
  server.get('/api/list/:locale', async (req, res) => {
    const patch = await readLocalePatch();
    const { locale } = req.params;
    if (!locale) {
      return res.status(500).json({
        error: 'Locale not provided',
      });
    }
    var songs = FolderSongs.getSongsMeta(locale, patch);
    res.json(songs);
  });

  server.get('/api/song/:key/:locale', async (req, res) => {
    const { key, locale } = req.params;
    if (!locale || !key) {
      return res.status(500).json({
        error: 'Locale or key not provided',
      });
    }
    const patch = await readLocalePatch();
    const songs = FolderSongs.getSongsMeta(locale, patch);
    const song = songs.find((s) => s.key === key);
    if (!song) {
      return res.status(500).json({
        error: `Song ${key} not valid`,
      });
    }

    await FolderSongs.loadSingleSong(locale, song, patch);
    if (song.error) {
      return res.status(500).json({
        error: song.error,
      });
    } else {
      // Buscar key previa y siguiente para navegacion
      const index = songs.indexOf(song);
      var prev = index - 1;
      while (prev >= 0 && songs[prev].notTranslated) {
        prev--;
      }
      var next = index + 1;
      while (next < songs.length && songs[next].notTranslated) {
        next++;
      }
      const previousKey = songs[prev] ? songs[prev].key : null;
      const nextKey = songs[next] ? songs[next].key : null;
      res.json({ song, index, previousKey, nextKey });
    }
  });

  server.get('/api/patches/:key/:locale', async (req, res) => {
    const { key, locale } = req.params;
    if (!locale || !key) {
      return res.status(500).json({
        error: 'Locale or key not provided',
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
        error: 'Locale or key not provided',
      });
    }
    var patchObj = await readLocalePatch();

    if (!patchObj) {
      patchObj = {};
    }
    if (!patchObj[key].hasOwnProperty(locale)) {
      return res.status(500).json({
        error: `Cant delete. Patch for locale ${locale} not found`,
      });
    }
    delete patchObj[key][locale];

    if (Object.keys(patchObj[key]).length === 0) {
      delete patchObj[key];
    }

    await saveLocalePatch(patchObj);
    console.log('Borrado patch', key);
    res.json({ ok: true });
  });

  server.post('/api/song/:key/:locale', async (req, res) => {
    const { key, locale } = req.params;
    if (!locale || !key) {
      return res.status(500).json({
        error: 'Locale or key not provided',
      });
    }
    var patchObj = await readLocalePatch();

    const patch: SongPatchData = req.body;
    if (!patchObj) {
      patchObj = {};
    }

    if (patch.rename) {
      patch.rename = patch.rename.trim();
    }

    patch.author = req.user.email;
    patch.date = Date.now();

    const localePatch: SongPatch = {
      [locale]: patch,
    };
    if (!patchObj[key]) {
      patchObj[key] = {};
    }
    var updatedPatch = merge(patchObj[key], localePatch);
    patchObj[key] = updatedPatch;

    await saveLocalePatch(patchObj);
    res.json({ ok: true });
  });

  server.post(
    '/api/pdf/:locale/:key?',
    asyncMiddleware(async (req, res, next) => {
      const { key, locale } = req.params;
      const { text, options } = req.body;
      if (!locale) {
        return res.status(500).json({
          error: 'Locale not provided',
        });
      }
      I18n.locale = locale;
      try {
        const parser = new SongsParser(PdfStyles);
        var items = [];
        if (key) {
          if (text === undefined) {
            return res.status(500).json({
              error: 'Text not provided',
            });
          }
          const patch = await readLocalePatch();
          const song = FolderSongs.getSingleSongMeta(key, locale, patch);
          await FolderSongs.loadSingleSong(locale, song, patch);
          const render = parser.getForRender(text, locale);
          const item: SongToPdf = {
            song,
            render,
          };
          items.push(item);
        } else {
          const patch = await readLocalePatch();
          var songs = FolderSongs.getSongsMeta(locale, patch);
          await FolderSongs.loadSongs(locale, songs, patch);
          songs.map((song) => {
            if (song.files[locale]) {
              var render = parser.getForRender(song.fullText, locale);
              const item: SongToPdf = {
                song,
                render,
              };
              items.push(item);
            }
          });
        }
        const pdfPath = await generatePDF(
          items,
          {
            ...defaultExportToPdfOptions,
            ...options,
          },
          ''
        );
        if (pdfPath) {
          res.sendFile(pdfPath, null, (err) => {
            if (err) {
              next(err);
            } else {
              console.log('Sent:', pdfPath);
            }
          });
        } else {
          return res.status(500).json({
            error: 'No file',
          });
        }
      } catch (err) {
        return res.status(500).json({
          error: err.message,
        });
      }
    })
  );
}
