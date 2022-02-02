import Layout from '~/components/Layout';
import SongEditor from '~/components/SongEditor';
import DataContextWrapper from '~/components/DataContext';
import EditContextWrapper from '~/components/EditContext';
import SongChangeMetadataDialog from '~/components/SongChangeMetadataDialog';
import ConfirmDialog from '~/components/ConfirmDialog';
import PatchLogDialog from '~/components/PatchLogDialog';
import DiffViewDialog from '~/components/DiffViewDialog';
import PdfSettingsDialog from '~/components/PdfSettingsDialog';
import { readLocalePatch } from '~/utils';
import FolderSongs from '~/FolderSongs';
import { json, LoaderFunction, useLoaderData } from 'remix';

export let loader: LoaderFunction = async ({ params }) => {
  const patch = await readLocalePatch();
  const { locale, key } = params;
  FolderSongs.basePath = require('path').resolve('../../songs');
  const songs = FolderSongs.getSongsMeta(locale, patch);
  const song = songs.find((s) => s.key === key);
  if (!song) {
    throw new Error(`Song ${key} not valid`);
  }
  await FolderSongs.loadSingleSong(locale, song, patch);
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
  return json({
    locale,
    song,
    index,
    previousKey,
    nextKey,
    totalSongs: songs.length,
  });
};

const SongEdit = () => {
  const { locale, song, index, previousKey, nextKey, totalSongs } =
    useLoaderData();

  const editable =
    song && song.notTranslated
      ? {
          key: song.key,
          nombre: `Translate name [${song.nombre}]`,
          titulo: `Translate title [${song.titulo}]`,
          fullText: 'New translated song text here.',
          stage: 'precatechumenate',
        }
      : song;

  if (!editable) {
    return <div>Not found</div>;
  }

  return (
    <DataContextWrapper>
      <EditContextWrapper
        index={index}
        song={editable}
        previousKey={previousKey}
        nextKey={nextKey}
        totalSongs={totalSongs}>
        <Layout title="Editor" locale={locale}>
          <SongEditor />
          <ConfirmDialog />
          <SongChangeMetadataDialog />
          <PatchLogDialog />
          <PdfSettingsDialog />
          <DiffViewDialog />
        </Layout>
      </EditContextWrapper>
    </DataContextWrapper>
  );
};

export default SongEdit;
