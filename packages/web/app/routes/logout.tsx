import { ActionFunction, redirect } from 'remix';
import { authenticator } from '~/auth.server';
import { commitSession, getSession } from '~/session.server';

export let action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get('Cookie'));
  session.set(authenticator.sessionKey, null);
  return redirect('/list', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};
