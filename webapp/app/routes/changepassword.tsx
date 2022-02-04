import bcrypt from 'bcryptjs';
import { getdb } from '~/utils.server';
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
  const db = await getdb();
  const userIndex = db.data.users.findIndex({ email: authData.user });
  if (userIndex === -1) {
    throw new Error('Usuario inválido.');
  }
  db.data.users[userIndex].password = newHash;
  db.write();
  return json({
    ok: `PasswordChanged`,
  });
};
