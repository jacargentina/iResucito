import { ActionFunction, redirect } from '@remix-run/node';
import { getSession, destroySession } from '~/session.server';

export let action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get('Cookie'));
  return redirect('/list', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};
