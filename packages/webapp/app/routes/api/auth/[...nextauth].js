import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import bcrypt from 'bcryptjs';
import { AUTH_SECRET, JWT_SECRET } from './secret';
import { db } from '../../../common';

const options = {
  secret: AUTH_SECRET,
  pages: {
    signIn: '/account',
  },
  jwt: {
    secret: JWT_SECRET,
  },
  callbacks: {
    /* eslint-disable no-unused-vars */
    /* eslint-disable no-param-reassign */
    session: async (session, jwtToken, sessionToken) => {
      session.user = jwtToken.userData;
      return Promise.resolve(session);
    },
    jwt: async (token, iresucitoUser, account, profile, isNewUser) => {
      const isSignIn = !!iresucitoUser;
      if (isSignIn) {
        token.userData = iresucitoUser.user;
      }
      return Promise.resolve(token);
    },
  },
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      id: 'iresucito',
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'iResucito',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {
          label: 'E-Mail',
          type: 'text',
          placeholder: 'Ingrese su dirección de e-mail',
        },
        password: { label: 'Contraseña', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const user = db
            .get('users')
            .find({ email: credentials.email })
            .value();

          if (user) {
            if (!user.isVerified) {
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject('/account?error=AccountNotVerified');
            }
            try {
              const result = bcrypt.compareSync(
                credentials.password,
                user.password
              );
              if (result) {
                // Registrar hora de inicio de sesion
                db.get('users')
                  .find({ email: credentials.email })
                  .assign({ loggedInAt: Date.now() })
                  .write();

                return Promise.resolve({
                  user: user.email,
                });
              }
              return Promise.resolve(null);
            } catch (err) {
              return Promise.resolve(null);
            }
          } else {
            return Promise.resolve(null);
          }
        } catch (e) {
          return Promise.resolve(null);
        }
      },
    }),
  ],
};

export default (req, res) => NextAuth(req, res, options);
