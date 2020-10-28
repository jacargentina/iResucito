// @flow
import React from 'react';
import Layout from 'components/Layout';
import SongList from 'components/SongList';
import PdfSettingsDialog from 'components/PdfSettingsDialog';
import DataContextWrapper from 'components/DataContext';
import I18n from '../../../../translations';
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

export async function getStaticProps({ params }: any) {
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
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const locales = Object.keys(I18n.translations);
  return {
    // $FlowFixMe
    paths: locales.map((item) => ({ params: { locale: item } })),
    fallback: false,
  };
}

export default List;
