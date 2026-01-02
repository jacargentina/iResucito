import etag from 'etag';
import Layout from '~/components/Layout';
import SongList from '~/components/SongList';
import PdfSettingsDialog from '~/components/PdfSettingsDialog';
import { LoaderFunction } from '@remix-run/node';
import { json } from '@vercel/remix';
import { useLoaderData } from '@remix-run/react';
import { getSession } from '~/session.server';
import { useApp } from '~/app.context';
import { Box, CircularProgress, Typography } from '@mui/material';
import i18n from '@iresucito/translations';
import { folderExtras, folderSongs } from '~/utils.server';
import PdfContextWrapper from '~/components/PdfContext';

export let loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  try {
    const patch = await folderExtras.readPatch();
    const locale = session.get('locale') as string;
    if (!locale) {
      throw new Error('Locale not provided');
    }
    const songs = folderSongs.getSongsMeta(locale, patch);
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
  const { songs } = useLoaderData<typeof loader>();

  return (
    <PdfContextWrapper>
      <Layout title="Buscador">
        {isChangingLanguage ? (
          <Box
            sx={{
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">{i18n.t('ui.loading')}</Typography>
          </Box>
        ) : (
          <SongList songs={songs} />
        )}
        <PdfSettingsDialog />
      </Layout>
    </PdfContextWrapper>
  );
};

export default List;
