import {
  PdfStyles,
  defaultExportToPdfOptions,
  SongsParser,
  SongToPdf,
  ExportToPdfOptions,
} from '@iresucito/core';
import i18n from '@iresucito/translations';
import { generatePDF } from '~/pdf';
import { ActionFunction, json } from '@remix-run/node';
import { getSession } from '~/session.server';

export let action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const locale = session.get('locale') as string;
  if (!locale) {
    throw new Error('Locale not provided');
  }
  const { key } = params;
  if (!key) {
    throw new Error('key not provided');
  }
  const body = await request.formData();
  const text = body.get('text') as string | undefined;
  const options = body.get('options') as string;
  i18n.locale = locale;
  try {
    const parser = new SongsParser(PdfStyles);
    const items = [];
    var addIndex = false;
    var filename = '';
    if (key == 'full') {
      addIndex = true;
      filename = `iResucito-${locale}`;
      const patch = await globalThis.folderExtras.readPatch();
      const songs = globalThis.folderSongs.getSongsMeta(locale, patch);
      await globalThis.folderSongs.loadSongs(locale, songs, patch);
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
    } else {
      if (text === undefined) {
        return json(
          {
            error: 'Text not provided',
          },
          { status: 500 }
        );
      }
      const patch = await globalThis.folderExtras.readPatch();
      const song = globalThis.folderSongs.getSingleSongMeta(key, locale, patch);
      await globalThis.folderSongs.loadSingleSong(locale, song, patch);
      const render = parser.getForRender(text, locale);
      const item: SongToPdf = {
        song,
        render,
      };
      items.push(item);
      filename = song.titulo;
    }
    const exportOpts: ExportToPdfOptions = {
      ...defaultExportToPdfOptions,
      ...JSON.parse(options),
    };
    const pdfPath = await generatePDF(items, exportOpts, filename, addIndex);
    if (pdfPath) {
      const pdfBuffer = require('fs').readFileSync(pdfPath);
      return new Response(pdfBuffer, {
        status: 200,
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
  } catch (err: any) {
    console.log('pdf ERROR:', err.message);
    return json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
};
