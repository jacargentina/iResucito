import { createCookieSessionStorage } from '@remix-run/node';

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: ['s3cr3t'],
    maxAge: 60 * 60 * 24 * 30,
  },
});

export let { getSession, commitSession, destroySession } = sessionStorage;
