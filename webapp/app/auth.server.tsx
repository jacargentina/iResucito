import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { sessionStorage } from '~/session.server';
import bcrypt from 'bcryptjs';
import { getdb } from '~/utils.server';

export let authenticator = new Authenticator<AuthData>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get('email');
    let password = form.get('password');

    const db = await getdb();
    const user = db.chain.get('users').find({ email: email }).value();

    if (user) {
      if (!user.isVerified) {
        throw new Error('Account not verified');
      }
      const result = bcrypt.compareSync(password, user.password);
      if (result) {
        // Registrar hora de inicio de sesion
        db.chain
          .get('users')
          .find({ email: email })
          .assign({ loggedInAt: Date.now() })
          .write();

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
