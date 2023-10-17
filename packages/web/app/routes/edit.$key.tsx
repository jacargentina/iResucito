import etag from 'etag';
import Layout from '~/components/Layout';
import SongEditor from '~/components/SongEditor';
import EditContextWrapper from '~/components/EditContext';
import SongChangeMetadataDialog from '~/components/SongChangeMetadataDialog';
import ConfirmDialog from '~/components/ConfirmDialog';
import PatchLogDialog from '~/components/PatchLogDialog';
import DiffViewDialog from '~/components/DiffViewDialog';
import PdfSettingsDialog from '~/components/PdfSettingsDialog';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getSession } from '~/session.server';

export let loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const locale = session.get('locale') as string;
  if (!locale) {
    throw new Error('Locale not provided');
  }
  const patch = await globalThis.folderExtras.readPatch();
  const { key } = params;
  const songs = globalThis.folderSongs.getSongsMeta(locale, patch);
  const song = songs.find((s) => s.key === key);
  if (!song) {
    throw new Error(`Song ${key} not valid`);
  }

  await globalThis.folderSongs.loadSingleSong(locale, song, patch);
  // Buscar key previa y siguiente para navegacion
  const index = songs.indexOf(song);
  let prev = index - 1;
  while (prev >= 0 && songs[prev].notTranslated) {
    prev -= 1;
  }
  let next = index + 1;
  while (next < songs.length && songs[next].notTranslated) {
    next += 1;
  }
  const previousKey = songs[prev] ? songs[prev].key : null;
  const nextKey = songs[next] ? songs[next].key : null;

  const headers = {
    'Cache-Control': 'max-age=0, must-revalidate',
    ETag: etag(JSON.stringify(song)),
  };

  if (request.headers.get('If-None-Match') === headers.ETag) {
    return new Response('', { status: 304, headers });
  }

  return json(
    {
      song,
      index,
      previousKey,
      nextKey,
      totalSongs: songs.length,
    },
    { headers }
  );
};

const SongEdit = () => {
  const { song, index, previousKey, nextKey, totalSongs } =
    useLoaderData<typeof loader>();

  const editable =
    song && song.notTranslated
      ? {
          key: song.key,
          nombre: song.nombre,
          titulo: song.titulo,
          fullText: 'New translated song text here.',
          stage: 'precatechumenate',
        }
      : song;

  if (!editable) {
    return <div>Not found</div>;
  }

  return (
    <EditContextWrapper
      index={index}
      song={editable}
      previousKey={previousKey}
      nextKey={nextKey}
      totalSongs={totalSongs}>
      <Layout title="Editor">
        <SongEditor />
        <ConfirmDialog />
        <SongChangeMetadataDialog />
        <PatchLogDialog />
        <PdfSettingsDialog />
        <DiffViewDialog />
      </Layout>
    </EditContextWrapper>
  );
};

export default SongEdit;
