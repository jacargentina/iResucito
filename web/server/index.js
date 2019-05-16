// @flow
if (!process.env.NODE_ENV) {
  throw new Error('Establecer un valor para NODE_ENV');
}

declare var PORT: number;

var port = PORT;
if (!port) {
  port = process.env.PORT;
}

if (!port) {
  throw new Error('Establecer un valor para PORT');
}

import * as path from 'path';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import FolderSongs from '../../src/FolderSongs';
import FolderExtras from '../../src/FolderExtras';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import jwt from 'jsonwebtoken';

const merge = require('deepmerge');

const dataPath = path.resolve(process.cwd(), '../data');

FolderSongs.basePath = path.resolve(process.cwd(), '../../songs');
FolderExtras.basePath = dataPath;

const adapter = new FileSync(path.join(dataPath, 'db.json'));
const db = low(adapter);

db.defaults({ users: [] }).write();

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
const webClientFolder = path.resolve('../dist');
server.use(express.static(webClientFolder));
server.get('/', (req, res) => {
  res.sendFile(path.join(webClientFolder, 'index.html'));
});

const jwtSecretKey = 'mysuperSecretKEY';

// Auth
server.use((req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, jwtSecretKey, (err, payload) => {
      console.log(payload);
      if (payload) {
        const user = db
          .get('users')
          .find({ email: payload.email })
          .value();
        req.user = user;
      } else {
        next();
      }
    });
  } catch (e) {
    next();
  }
});

server.post('/api/signup', (req, res) => {
  const { email, password } = req.body;
  const exists = db
    .get('users')
    .find({ email: email })
    .value();
  if (exists) {
    console.log({ exists });
    return res.status(500).json({
      error: `Email ${email} ya registrado!`
    });
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log({ err });
      return res.status(500).json({
        error: err
      });
    }
    const result = db
      .get('users')
      .push({
        email: email,
        password: hash
      })
      .write();
    console.log({ result });
    res.status(200).json({
      success: 'El usuario ha sido registrado!'
    });
  });
});

server.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = db
    .get('users')
    .find({ email: email })
    .value();

  if (user) {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          error: 'Acceso no autorizado'
        });
      }
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
          success: 'Bienvenido!',
          token: JWTToken
        });
      }
      return res.status(401).json({
        error: 'Acceso no autorizado'
      });
    });
  } else {
    res.status(500).json({
      error: 'Usuario o contraseña incorrecta'
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
    res.status(500).json({ error: 'Acceso no autorizado' });
  }
});

server.get('/api/list/:locale', async (req, res) => {
  const patch = await readLocalePatch();
  const { locale } = req.params;
  var songs = FolderSongs.getSongsMeta(locale, patch);
  res.json(songs);
});

server.get('/api/song/:key/:locale', async (req, res) => {
  const patch = await readLocalePatch();
  const { key, locale } = req.params;
  const songs = FolderSongs.getSongsMeta(locale, patch);
  const song = songs.find(s => s.key === key);
  if (song) {
    await FolderSongs.loadSingleSong(locale, song, patch);
    res.json(song);
  }
});

server.delete('/api/song/:key/:locale', async (req, res) => {
  var patchObj = await readLocalePatch();
  const { key, locale } = req.params;

  if (!patchObj) patchObj = {};
  delete patchObj[key][locale];

  await saveLocalePatch(patchObj);
  console.log('Borrado patch', key);
  res.json({ ok: true });
});

server.post('/api/song/:key/:locale', async (req, res) => {
  var patchObj = await readLocalePatch();
  const { key, locale } = req.params;

  const patch: SongPatchData = req.body;
  if (!patchObj) patchObj = {};

  if (patch.rename) {
    patch.rename = patch.rename.trim();
  }
  const localePatch: SongPatch = {
    [locale]: patch
  };
  if (!patchObj[key]) {
    patchObj[key] = {};
  }
  var updatedPatch = merge(patchObj[key], localePatch);
  patchObj[key] = updatedPatch;

  await saveLocalePatch(patchObj);
  console.log('Guardado patch', key, updatedPatch);
  res.json({ ok: true });
});

require('http')
  .createServer(server)
  .listen(port, function() {
    console.log('Http on port', port);
  });
