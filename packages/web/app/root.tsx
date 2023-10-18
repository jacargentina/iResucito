import { useEffect } from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useFetcher,
  useNavigate,
  useLocation,
  useRouteError,
  isRouteErrorResponse,
} from '@remix-run/react';
import { LoaderFunction } from '@remix-run/node';
import { authenticator } from './auth.server';
import { AppProvider } from './app.context';
import { getSession } from './session.server';
import { getPatchStats } from '@iresucito/core';
import i18n from '@iresucito/translations';
import semanticUrl from 'semantic-ui-css/semantic.min.css';
import globalStylesUrl from './styles/global.css';
import AppRaw from '@iresucito/native/app.json';

export let loader: LoaderFunction = async ({ request }) => {
  const patch = await globalThis.folderExtras.readPatch();
  const stats = patch ? getPatchStats(patch) : [];

  const authData = await authenticator.isAuthenticated(request);
  const session = await getSession(request.headers.get('Cookie'));

  return {
    EXPO_VERSION: AppRaw.expo.version,
    authData: authData,
    patchStats: stats,
    locale: session.get('locale'),
  };
};

export let links = () => {
  return [
    { rel: 'stylesheet', href: globalStylesUrl },
    { rel: 'stylesheet', href: semanticUrl },
  ];
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{ newLocale: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (data.locale) {
      i18n.locale = data.locale;
      if (location.pathname === '/') {
        navigate('/list');
      }
    } else {
      fetcher.submit(null, {
        action: '/lang/' + navigator.language,
        method: 'post',
      });
    }
  }, [data, location]);

  useEffect(() => {
    if (fetcher.data?.newLocale) {
      i18n.locale = fetcher.data?.newLocale;
      navigate(`/list`);
    }
  }, [fetcher.data]);

  return (
    <AppProvider
      user={data.authData?.user}
      expo_version={data.EXPO_VERSION}
      patchStats={data.patchStats}
      locale={data.locale}>
      <Document>
        <Outlet />
      </Document>
    </AppProvider>
  );
}

function Document({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>iResucito</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error: any = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  let errorMessage = error.message;

  return (
    <ErrorDocument title="Error!">
      <h1>{errorMessage}</h1>
    </ErrorDocument>
  );
}

function ErrorDocument({ children, title }: { children: any; title: string }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{title}</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
