import bcrypt from 'bcryptjs';
import { db } from '~/utils';
import { ActionFunction, json } from 'remix';
import { authenticator } from '~/auth.server';

export let action: ActionFunction = async ({ request }) => {
  let authData = await authenticator.isAuthenticated(request);
  if (!authData) {
    throw new Error('No autenticado.');
  }
  const body = await request.formData();
  const newPassword = body.get('newPassword') as string;
  const newHash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
  if (!db.get('users').find({ email: authData.user }).value()) {
    throw new Error('Usuario inválido.');
  }
  db.get('users')
    .find({ email: authData.user })
    .assign({ password: newHash })
    .write();
  return json({
    ok: `PasswordChanged`,
  });
};
