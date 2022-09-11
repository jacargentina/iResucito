import { createCookieSessionStorage } from '@remix-run/node';

let exp = new Date();
exp.setDate(exp.getDate() + 30); // 30 dias

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: ['s3cr3t'],
    expires: exp,
  },
});

export let { getSession, commitSession, destroySession } = sessionStorage;
