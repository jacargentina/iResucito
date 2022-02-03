import { ActionFunction } from 'remix';
import { authenticator } from '~/auth.server';

export let action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const redirectTo = (body.get('callbackUrl') as string) ?? '/';
  await authenticator.logout(request, { redirectTo });
};
