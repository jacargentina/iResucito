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
import bodyParser from 'body-parser';
import FolderSongs from '../../src/FolderSongs';
import FolderExtras from '../../src/FolderExtras';

const merge = require('deepmerge');

FolderSongs.basePath = path.resolve(process.cwd(), '../../songs');
FolderExtras.basePath = path.resolve(process.cwd(), '../data');

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

// API
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
