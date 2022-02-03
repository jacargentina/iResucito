import { SongsParser } from '~/SongsParser';
import { generatePDF } from '~/scripts/pdf';
import { PdfStyles, defaultExportToPdfOptions } from '~/common';
import { readLocalePatch } from '~/utils';
import FolderSongs from '~/FolderSongs';
import I18n from '~/translations';

export default async function handler(req, res) {
  const { path } = req.query;
  const [locale, key] = path;
  const { text, options } = req.body;
  if (!locale) {
    return res.status(500).json({
      error: 'Locale not provided',
    });
  }
  I18n.locale = locale;
  try {
    FolderSongs.basePath = require('path').resolve('../../songs');
    const parser = new SongsParser(PdfStyles);
    const items = [];
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
      const songs = FolderSongs.getSongsMeta(locale, patch);
      await FolderSongs.loadSongs(locale, songs, patch);
      songs.forEach((song) => {
        if (song.files[locale]) {
          const render = parser.getForRender(song.fullText, locale);
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
      res.setHeader('Content-Type', 'application/pdf');
      const pdfBuffer = require('fs').readFileSync(pdfPath);
      res.send(pdfBuffer);
      console.log('Sent:', pdfPath);
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
}
