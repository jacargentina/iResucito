import Layout from '~/components/Layout';
import SongList from '~/components/SongList';
import PdfSettingsDialog from '~/components/PdfSettingsDialog';
import DataContextWrapper from '~/components/DataContext';
import { readLocalePatch } from '~/utils';
import FolderSongs from '~/FolderSongs';
import { json, LoaderFunction, useLoaderData } from 'remix';

export let loader: LoaderFunction = async ({ params }) => {
  const patch = await readLocalePatch();
  const { locale } = params;
  if (!locale) {
    throw new Error('Locale not provided');
  }
  const songs = FolderSongs.getSongsMeta(locale, patch);
  return json({
    locale,
    songs,
  });
};

const List = () => {
  const { locale, songs } = useLoaderData();

  return (
    <DataContextWrapper>
      <Layout title="Buscador" locale={locale}>
        <SongList songs={songs} />
        <PdfSettingsDialog />
      </Layout>
    </DataContextWrapper>
  );
};

export default List;
