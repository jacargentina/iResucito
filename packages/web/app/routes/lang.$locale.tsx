import { ActionFunction, json } from '@remix-run/node';
import { commitSession, getSession } from '~/session.server';

export let action: ActionFunction = async ({ request, params }) => {
  const { locale } = params;
  const session = await getSession(request.headers.get('Cookie'));
  session.set('locale', locale);
  return json(
    { newLocale: locale },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};
