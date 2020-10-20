// @flow
import React from 'react';
import Layout from 'components/Layout';
import SongEditor from 'components/SongEditor';
import DataContextWrapper from 'components/DataContext';
import EditContextWrapper from 'components/EditContext';
import SongChangeMetadataDialog from 'components/SongChangeMetadataDialog';
import ConfirmDialog from 'components/ConfirmDialog';
import PatchLogDialog from 'components/PatchLogDialog';
import PdfSettingsDialog from 'components/PdfSettingsDialog';
import { getLocalesForPicker } from '../../../../common';
import { readLocalePatch } from '../../common';
import FolderSongs from '../../../../FolderSongs';

const SongEdit = (props: any) => {
  const { song, index, previousKey, nextKey, totalSongs } = props;

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
        <Layout title="Editor">
          <SongEditor />
          <ConfirmDialog />
          <SongChangeMetadataDialog />
          <PatchLogDialog />
          <PdfSettingsDialog />
        </Layout>
      </EditContextWrapper>
    </DataContextWrapper>
  );
};

export async function getStaticProps({ params }: any) {
  const patch = await readLocalePatch();
  const { path } = params;
  const [locale, key] = path;
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
  return {
    props: {
      song,
      index,
      previousKey,
      nextKey,
      totalSongs: songs.length,
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const locales = getLocalesForPicker('en');
  const patch = await readLocalePatch();
  // $FlowFixMe
  const localesPaths = locales.map((item) => {
    const songs = FolderSongs.getSongsMeta(item.value, patch);
    return songs.map((song) => {
      return {
        params: {
          path: [item.value, song.key],
        },
      };
    });
  });
  return {
    paths: localesPaths.flat(),
    fallback: true,
  };
}

export default SongEdit;
