import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { sessionStorage } from '~/session.server';
import bcrypt from 'bcryptjs';
import { getdb } from '~/utils';

export let authenticator = new Authenticator<AuthData>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let identifier = form.get('identifier');
    let password = form.get('password');
    try {
      const user = await getdb()
        .get('users')
        .find({ email: identifier })
        .value();

      if (user) {
        if (!user.isVerified) {
          throw new Error('/account?error=AccountNotVerified');
        }
        const result = bcrypt.compareSync(password, user.password);
        if (result) {
          // Registrar hora de inicio de sesion
          await getdb()
            .get('users')
            .find({ email: identifier })
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
    } catch (err) {
      throw new Error('auth error:', (err as Error).message);
    }
  }),
  'lowdb'
);
