import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import * as _ from 'lodash';
import bcrypt from 'bcryptjs';
import { AUTH_SECRET, JWT_SECRET } from './secret';
import { db, readLocalePatch } from '../../../common';

const getStats = async (user: any) => {
  const stats = [];
  const patch = await readLocalePatch();
  if (patch) {
    const newItemsSinceLastLogin = [];
    Object.keys(patch).forEach((key) => {
      const songPatch = patch[key];
      Object.keys(songPatch).forEach((rawLoc) => {
        const item = songPatch[rawLoc];
        if (item.date > (user.loggedInAt || 0)) {
          newItemsSinceLastLogin.push(item);
        }
      });
    });
    const byAuthor = _.groupBy(newItemsSinceLastLogin, (i) => i.author);
    Object.keys(byAuthor).forEach((author) => {
      stats.push({ author, count: byAuthor[author].length });
    });
  }
  return stats;
};

const options = {
  secret: AUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  jwt: {
    secret: JWT_SECRET,
  },
  callbacks: {
    // eslint-disable-next-line no-unused-vars
    session: async (session, jwtToken, sessionToken) => {
      // eslint-disable-next-line no-param-reassign
      session.user = jwtToken.userData;
      session.stats = jwtToken.statsData;
      return Promise.resolve(session);
    },
    // eslint-disable-next-line no-unused-vars
    jwt: async (token, iresucitoUser, account, profile, isNewUser) => {
      const isSignIn = !!iresucitoUser;
      if (isSignIn) {
        // eslint-disable-next-line no-param-reassign
        token.userData = iresucitoUser.user;
        token.statsData = iresucitoUser.stats;
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
              return Promise.reject(
                new Error('Unauthorized access. Account was not verified.')
              );
            }
            try {
              const result = bcrypt.compareSync(
                credentials.password,
                user.password
              );
              if (result) {
                const stats = await getStats(user);

                // Registrar hora de inicio de sesion
                db.get('users')
                  .find({ email: credentials.email })
                  .assign({ loggedInAt: Date.now() })
                  .write();

                return Promise.resolve({
                  user: user.email,
                  stats,
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
