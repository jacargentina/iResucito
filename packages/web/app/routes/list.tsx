import etag from 'etag';
import Layout from '~/components/Layout';
import SongList from '~/components/SongList';
import PdfSettingsDialog from '~/components/PdfSettingsDialog';
import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getSession } from '~/session.server';
import { useApp } from '~/app.context';
import { Loader } from 'semantic-ui-react';
import i18n from '@iresucito/translations';

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  try {
    const patch = await globalThis.folderExtras.readPatch();
    const locale = session.get('locale') as string;
    if (!locale) {
      throw new Error('Locale not provided');
    }
    const songs = globalThis.folderSongs.getSongsMeta(locale, patch);
    const headers = {
      'Cache-Control': 'max-age=0, must-revalidate',
      ETag: etag(JSON.stringify(songs)),
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
            content={i18n.t('ui.loading')}
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
