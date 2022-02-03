import { SongsParser } from '~/SongsParser';
import { generatePDF } from '~/scripts/pdf';
import { PdfStyles, defaultExportToPdfOptions } from '~/common';
import { folderSongs, readLocalePatch } from '~/utils.server';
import I18n from '~/translations';
import { ActionFunction, json } from 'remix';

export let action: ActionFunction = async ({ request, params }) => {
  const { key, locale } = params;
  if (!key) {
    throw new Error('key not provided');
  }
  if (!locale) {
    throw new Error('locale not provided');
  }
  const body = await request.formData();
  const text = body.get('text') as string | undefined;
  const options = body.get('options') as string;
  I18n.locale = locale;
  try {
    const parser = new SongsParser(PdfStyles);
    const items = [];
    if (key) {
      if (text === undefined) {
        return json(
          {
            error: 'Text not provided',
          },
          { status: 500 }
        );
      }
      const patch = await readLocalePatch();
      const song = folderSongs.getSingleSongMeta(key, locale, patch);
      await folderSongs.loadSingleSong(locale, song, patch);
      const render = parser.getForRender(text, locale);
      const item: SongToPdf = {
        song,
        render,
      };
      items.push(item);
    } else {
      const patch = await readLocalePatch();
      const songs = folderSongs.getSongsMeta(locale, patch);
      await folderSongs.loadSongs(locale, songs, patch);
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
        ...JSON.parse(options),
      },
      ''
    );
    if (pdfPath) {
      const pdfBuffer = require('fs').readFileSync(pdfPath);
      const buffer = require('buffer');
      const blob = new buffer.Blob(pdfBuffer);
      return new Response(blob, {
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
    } else {
      return json(
        {
          error: 'No file',
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.log('pdf ERROR:', err.message);
    return json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
};
