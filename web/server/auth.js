// @flow
import * as _ from 'lodash';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto-random-string';
import send from 'gmail-send';
import { db, asyncMiddleware, readLocalePatch } from './common';

const jwtSecretKey = 'mysuperSecretKEY';
const domain = 'http://iresucito.herokuapp.com';

const mailSender = send({
  user: 'javier.alejandro.castro@gmail.com',
  pass: process.env.GMAIL_PASSWORD,
  subject: 'iResucito Web'
});

export default function(server: any) {
  server.use(async (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        const payload = await jwt.verify(token, jwtSecretKey);
        if (payload) {
          const user = db
            .get('users')
            .find({ email: payload.email })
            .value();
          req.user = user;
        }
      } catch (e) {
        console.log(e);
      }
    }
    next();
  });

  server.post('/api/signup', (req, res) => {
    var { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({
        error: 'Provide an email and password to register'
      });
    }
    // Quitar espacios
    email = email.trim();
    const exists = db
      .get('users')
      .find({ email: email })
      .value();
    if (exists) {
      return res.status(500).json({
        error: `Email ${email} already registered!`
      });
    }
    try {
      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      // Crear usuario
      db.get('users')
        .push({
          email: email,
          password: hash,
          isVerified: false,
          createdAt: Date.now()
        })
        .write();
      // Crear token para verificacion
      const token = crypto({ length: 20, type: 'url-safe' });
      db.get('tokens')
        .push({
          email: email,
          token: token
        })
        .write();
      mailSender(
        {
          to: email,
          text: `Navigate this link ${domain}/api/verify/${token}/${email} to activate your account.`
        },
        (err, res) => {
          console.log({ mailSend: { err, res } });
        }
      );
      return res.status(200).json({
        ok: `User registered. 
Open your inbox and activate your account 
with the email we've just sent to you!`
      });
    } catch (err) {
      console.log({ err });
      return res.status(500).json({
        error: err
      });
    }
  });

  server.get('/api/verify/:token/:email', (req, res) => {
    const { token, email } = req.params;
    const user = db
      .get('users')
      .find({ email: email })
      .value();

    if (user) {
      if (user.isVerified) {
        return res.status(202).json({ ok: 'Email Already Verified' });
      } else {
        const foundToken = db
          .get('tokens')
          .find({ email: email, token: token })
          .value();

        if (foundToken) {
          db.get('users')
            .find({ email: email })
            .assign({ isVerified: true })
            .write();
          db.get('tokens')
            .remove({ email: email, token: token })
            .write();
          return res.redirect(301, `${domain}?u=${email}&verified=1`);
        } else {
          return res.status(404).json({ error: 'Token expired' });
        }
      }
    } else {
      return res.status(404).json({ error: 'Email not found' });
    }
  });

  server.post(
    '/api/login',
    asyncMiddleware(async (
      req,
      res,
      /* eslint-disable no-unused-vars */ next
    ) => {
      const { email, password } = req.body;
      const user = db
        .get('users')
        .find({ email: email })
        .value();

      if (user) {
        if (!user.isVerified) {
          res.status(401).json({
            error: 'Unauthorized access. Account was not verified.'
          });
        }
        try {
          const result = bcrypt.compareSync(password, user.password);
          if (result) {
            const JWTToken = jwt.sign(
              {
                email: user.email
              },
              jwtSecretKey,
              {
                expiresIn: '6h'
              }
            );
            var stats = [];
            const patch = await readLocalePatch();
            if (patch) {
              var newItemsSinceLastLogin = [];
              Object.keys(patch).forEach(key => {
                const songPatch = patch[key];
                Object.keys(songPatch).forEach(rawLoc => {
                  const item = songPatch[rawLoc];
                  if (item.date > (user.loggedInAt || 0)) {
                    newItemsSinceLastLogin.push(item);
                  }
                });
              });
              const byAuthor = _.groupBy(newItemsSinceLastLogin, i => i.author);
              Object.keys(byAuthor).forEach(author => {
                stats.push({ author: author, count: byAuthor[author].length });
              });
            }
            // Registrar hora de inicio de sesion
            db.get('users')
              .find({ email: email })
              .assign({ loggedInAt: Date.now() })
              .write();
            return res.status(200).json({
              jwt: JWTToken,
              stats: stats
            });
          }
          return res.status(401).json({
            error: 'Unauthorized access'
          });
        } catch (err) {
          res.status(401).json({
            error: 'Unauthorized access'
          });
        }
      } else {
        res.status(500).json({
          error: 'User or password wrong'
        });
      }
    })
  );

  // Todas las rutas a partir de este punto
  // estan protegidas!
  server.use((req, res, next) => {
    if (req.user) {
      // si el usuario ha sido validado, continuar
      next();
    } else {
      // No hay user, no hay token!
      res.status(500).json({ error: 'Unauthorized access' });
    }
  });
}
