import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { sessionStorage } from './session.server';
import { db } from './utils.server';
import bcrypt from 'bcryptjs';

export let authenticator = new Authenticator<AuthData>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get('email');
    let password = form.get('password') as string;

    // @ts-ignore
    const userIndex = db.data.users.findIndex(
      (u) => u.email === email
    );
    // @ts-ignore
    const user = db.data.users[userIndex];
    if (user) {
      if (!user.isVerified) {
        throw new Error('Account not verified');
      }
      const result = bcrypt.compareSync(password, user.password);
      if (result) {
        // Registrar hora de inicio de sesion
        // @ts-ignore
        db.data.users[userIndex].loggedInAt = Date.now();
        db.write();
        return {
          user: user.email,
        };
      }
      throw new Error('Invalid password');
    } else {
      throw new Error('Invalid user');
    }
  }),
  'lowdb'
);
