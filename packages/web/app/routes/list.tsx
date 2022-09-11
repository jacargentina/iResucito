import Layout from '~/components/Layout';
import SongList from '~/components/SongList';
import PdfSettingsDialog from '~/components/PdfSettingsDialog';
import { readLocalePatch, folderSongs } from '~/utils.server';
import { json, LoaderFunction, useLoaderData } from 'remix';
import { getSession } from '~/session.server';
import { useApp } from '~/app.context';
import { Loader } from 'semantic-ui-react';
import I18n from '@iresucito/translations';

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  try {
    const patch = await readLocalePatch();
    const locale = session.get('locale') as string;
    if (!locale) {
      throw new Error('Locale not provided');
    }
    const songs = folderSongs.getSongsMeta(locale, patch);
    const etag = await import('etag');
    const headers = {
      'Cache-Control': 'max-age=0, must-revalidate',
      ETag: etag.default(JSON.stringify(songs)),
    };
    if (request.headers.get('If-None-Match') === headers.ETag) {
      return new Response('', { status: 304, headers });
    }
    return json({ songs }, { headers });
  } catch (err) {
    console.log(err);
    return json({ songs: [] });
  }
};

const List = () => {
  const { isChangingLanguage } = useApp();
  const { songs } = useLoaderData();

  return (
    <Layout title="Buscador">
      {isChangingLanguage ? (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Loader
            active
            inline="centered"
            size="large"
            content={I18n.t('ui.loading')}
          />
        </div>
      ) : (
        <SongList songs={songs} />
      )}
      <PdfSettingsDialog />
    </Layout>
  );
};

export default List;
