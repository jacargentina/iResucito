// @flow
if (!process.env.NODE_ENV) {
  throw new Error('Establecer un valor para NODE_ENV');
}
if (!process.env.PORT) {
  throw new Error('Establecer un valor para PORT');
}

import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import FolderSongs from '../../src/FolderSongs';
import FolderExtras from '../../src/FolderExtras';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import jwt from 'jsonwebtoken';
import send from 'gmail-send';
import crypto from 'crypto-random-string';
import chokidar from 'chokidar';

const patches = fs.readFileSync('./songs/patches.json', 'utf8');
const songPatches: SongPatchLog = JSON.parse(patches);

const mailSender = send({
  user: 'javier.alejandro.castro@gmail.com',
  pass: process.env.GMAIL_PASSWORD,
  subject: 'iResucito Web'
});

const merge = require('deepmerge');

const dataPath = path.resolve('./web/data');
const syncScriptPath = path.resolve('./web/server');

FolderSongs.basePath = path.resolve('./songs');
FolderExtras.basePath = dataPath;

const adapter = new FileSync(path.join(dataPath, 'db.json'));
const db = low(adapter);

db.defaults({ users: [], tokens: [] }).write();

const watcher = chokidar.watch(dataPath, {
  persistent: true,
  ignoreInitial: true
});

watcher
  .on('add', path => {
    cp.spawn('node', ['./syncData.js', 'up', path], {
      cwd: syncScriptPath
    });
  })
  .on('change', path => {
    cp.spawn('node', ['./syncData.js', 'up', path], {
      cwd: syncScriptPath
    });
  });

async function readLocalePatch(): ?SongIndexPatch {
  const exists = await FolderExtras.patchExists();
  if (exists) {
    const patchJSON = await FolderExtras.readPatch();
    return JSON.parse(patchJSON);
  }
}

async function saveLocalePatch(patchObj: ?SongIndexPatch) {
  var json = JSON.stringify(patchObj, null, ' ');
  await FolderExtras.savePatch(json);
}

// App principal
var server = express();
server.use(bodyParser.json());
server.use(cors());

// Recursos estaticos, index.html
const webClientFolder = path.resolve('./web/dist');
server.use(express.static(webClientFolder));
server.get('/', (req, res) => {
  res.sendFile(path.join(webClientFolder, 'index.html'));
});

const jwtSecretKey = 'mysuperSecretKEY';
const domain = 'http://iresucito.herokuapp.com';

// Auth
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json({
      error: 'Provide an email and password to register'
    });
  }
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
        isVerified: false
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

server.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = db
    .get('users')
    .find({ email: email })
    .value();

  if (user) {
    if (!user.isVerified) {
      return res.status(401).json({
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
            expiresIn: '2h'
          }
        );
        return res.status(200).json({
          jwt: JWTToken
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
});

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

server.get('/api/list/:locale', async (req, res) => {
  const patch = await readLocalePatch();
  const { locale } = req.params;
  if (!locale) {
    return res.status(500).json({
      error: 'Locale not provided'
    });
  }
  var songs = FolderSongs.getSongsMeta(locale, patch);
  res.json(songs);
});

server.get('/api/song/:key/:locale', async (req, res) => {
  const { key, locale } = req.params;
  if (!locale || !key) {
    return res.status(500).json({
      error: 'Locale or key not provided'
    });
  }
  const patch = await readLocalePatch();
  const songs = FolderSongs.getSongsMeta(locale, patch);
  const song = songs.find(s => s.key === key);
  if (song) {
    await FolderSongs.loadSingleSong(locale, song, patch);
    res.json(song);
  }
});

server.get('/api/patches/:key/:locale', async (req, res) => {
  const { key, locale } = req.params;
  if (!locale || !key) {
    return res.status(500).json({
      error: 'Locale or key not provided'
    });
  }
  const p = songPatches[key];
  if (p) {
    const changes = p.filter(p => p.locale === locale);
    res.json(changes);
  } else {
    res.json([]);
  }
});

server.get('/api/song/newKey', async (req, res) => {
  const patch = await readLocalePatch();
  const songs = FolderSongs.getSongsMeta('es', patch);
  const songMaxKey = songs.reduce((prev, next) => {
    if (Number(prev.key) > Number(next.key)) {
      return prev;
    }
    return next;
  }, songs[0]);
  const newKey = Number(songMaxKey.key) + 1;
  res.json({ key: newKey });
});

server.delete('/api/song/:key/:locale', async (req, res) => {
  const { key, locale } = req.params;
  if (!locale || !key) {
    return res.status(500).json({
      error: 'Locale or key not provided'
    });
  }
  var patchObj = await readLocalePatch();

  if (!patchObj) patchObj = {};
  delete patchObj[key][locale];

  await saveLocalePatch(patchObj);
  console.log('Borrado patch', key);
  res.json({ ok: true });
});

server.post('/api/song/:key/:locale', async (req, res) => {
  const { key, locale } = req.params;
  if (!locale || !key) {
    return res.status(500).json({
      error: 'Locale or key not provided'
    });
  }
  var patchObj = await readLocalePatch();

  const patch: SongPatchData = req.body;
  if (!patchObj) patchObj = {};

  if (patch.rename) {
    patch.rename = patch.rename.trim();
  }

  patch.author = req.user.email;

  const localePatch: SongPatch = {
    [locale]: patch
  };
  if (!patchObj[key]) {
    patchObj[key] = {};
  }
  var updatedPatch = merge(patchObj[key], localePatch);
  patchObj[key] = updatedPatch;

  await saveLocalePatch(patchObj);
  res.json({ ok: true });
});

// Start server
const port = process.env.PORT || 3000;
require('http')
  .createServer(server)
  .listen(port, function() {
    console.log('Http on port', port);
  });
