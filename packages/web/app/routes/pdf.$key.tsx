import { SongsParser } from '@iresucito/core';
import i18n from '@iresucito/translations';
import { ActionFunction } from '@remix-run/node';
import { json } from '@vercel/remix';
import { getSession } from '~/session.server';
import { PdfStyle, SongToPdf, PdfStyles } from '@iresucito/core';
import { generatePDF } from '@iresucito/core/generatepdf';
import { readFileSync, folderExtras, folderSongs } from '~/utils.server';

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
      const patch = await folderExtras.readPatch();
      const songs = folderSongs.getSongsMeta(locale, patch);
      await folderSongs.loadSongs(locale, songs, patch);
      songs.forEach((song) => {
        if (song.files[locale]) {
          const render = parser.getForRender(song.fullText, locale);
          const item: SongToPdf<PdfStyle> = {
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
      const patch = await folderExtras.readPatch();
      const song = folderSongs.getSingleSongMeta(key, locale, patch);
      await folderSongs.loadSingleSong(locale, song, patch);
      const render = parser.getForRender(text, locale);
      const item: SongToPdf<PdfStyle> = {
        song,
        render,
      };
      items.push(item);
      filename = song.titulo;
    }
    const pdfPath = await generatePDF(items, PdfStyles, filename, addIndex);
    if (pdfPath) {
      const pdfBuffer = readFileSync(pdfPath);
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
