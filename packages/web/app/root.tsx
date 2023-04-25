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

export let loader: LoaderFunction = async ({ request }) => {
  const path = require('path');
  const fs = require('fs');
  const plist = require('plist');

  var ios_version;
  var android_version;

  try {
    const ios_Info = plist.parse(
      fs.readFileSync(path.join(__dirname, '/../public/Info.plist'), 'utf8')
    );
    ios_version = `${ios_Info.CFBundleShortVersionString}.${ios_Info.CFBundleVersion}`;
  } catch {
    ios_version = 'err';
  }

  try {
    const androidGradle = fs.readFileSync(
      path.join(__dirname, '/../public/build.gradle'),
      'utf8'
    );
    // @ts-ignore
    const android_major = /def VERSION_MAJOR=(.*)/.exec(androidGradle)[1];
    // @ts-ignore
    const android_minor = /def VERSION_MINOR=(.*)/.exec(androidGradle)[1];
    // @ts-ignore
    const android_patch = /def VERSION_PATCH=(.*)/.exec(androidGradle)[1];
    // @ts-ignore
    const android_build = /def VERSION_BUILD=(.*)/.exec(androidGradle)[1];

    android_version = `${android_major}.${android_minor}.${android_patch}.${android_build}`;
  } catch {
    android_version = 'err';
  }

  const patch = await globalThis.folderExtras.readPatch();
  const stats = patch ? getPatchStats(patch) : [];

  const authData = await authenticator.isAuthenticated(request);
  const session = await getSession(request.headers.get('Cookie'));

  return {
    IOS_VERSION: ios_version,
    ANDROID_VERSION: android_version,
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
  const data = useLoaderData();
  const fetcher = useFetcher();
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
      ios_version={data.IOS_VERSION}
      android_version={data.ANDROID_VERSION}
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
