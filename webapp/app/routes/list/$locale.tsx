import Layout from '~/components/Layout';
import SongList from '~/components/SongList';
import PdfSettingsDialog from '~/components/PdfSettingsDialog';
import { readLocalePatch, folderSongs } from '~/utils.server';
import { json, LoaderFunction, useLoaderData } from 'remix';

export let loader: LoaderFunction = async ({ params }) => {
  try {
    const patch = await readLocalePatch();
    const { locale } = params;
    if (!locale) {
      throw new Error('Locale not provided');
    }
    const songs = folderSongs.getSongsMeta(locale, patch);
    return json({
      locale,
      songs,
    });
  } catch (err) {
    console.log(err);
    return json({ locale: '', songs: [] });
  }
};

const List = () => {
  const { locale, songs } = useLoaderData();

  return (
    <Layout title="Buscador" locale={locale}>
      <SongList songs={songs} />
      <PdfSettingsDialog />
    </Layout>
  );
};

export default List;
