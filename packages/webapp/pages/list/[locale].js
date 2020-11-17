// @flow
import React from 'react';
import Layout from 'components/Layout';
import SongList from 'components/SongList';
import PdfSettingsDialog from 'components/PdfSettingsDialog';
import DataContextWrapper from 'components/DataContext';
import { readLocalePatch } from '../../common';
import FolderSongs from '../../../../FolderSongs';

const List = (props: any) => {
  const { songs } = props;

  return (
    <DataContextWrapper>
      <Layout title="Buscador">
        <SongList songs={songs} />
        <PdfSettingsDialog />
      </Layout>
    </DataContextWrapper>
  );
};

export async function getServerSideProps({ params }: any) {
  const patch = await readLocalePatch();
  const { locale } = params;
  if (!locale) {
    throw new Error('Locale not provided');
  }
  const songs = FolderSongs.getSongsMeta(locale, patch);
  return {
    props: {
      songs,
    },
  };
}

export default List;
