import { ActionFunction, redirect } from 'remix';
import { commitSession, getSession } from '~/session.server';

export let action: ActionFunction = async ({ request, params }) => {
  const { locale } = params;
  const session = await getSession(request.headers.get('Cookie'));
  session.set('locale', locale);
  return redirect(`/`, {
    status: 205,
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};
