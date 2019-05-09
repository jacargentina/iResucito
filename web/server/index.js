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
import FolderSongs from '../../src/FolderSongs';

FolderSongs.basePath = path.resolve(process.cwd(), '../../songs');

// App principal
var server = express();
server.use(cors());

// Recursos estaticos, index.html
const webClientFolder = path.resolve('../dist');
server.use(express.static(webClientFolder));
server.get('/', (req, res) => {
  res.sendFile(path.join(webClientFolder, 'index.html'));
});

// API
server.get('/api/list/:locale', (req, res) => {
  var songs = FolderSongs.getSongsMeta(req.params.locale);
  res.json(songs);
});

server.get('/api/song/:key/:locale', (req, res) => {
  var songs = FolderSongs.getSongsMeta(req.params.locale);
  const song = songs.find(s => s.key === req.params.key);
  if (song) {
    FolderSongs.loadSingleSong(song).then(() => {
      res.json(song);
    });
  }
});

require('http')
  .createServer(server)
  .listen(port, function() {
    console.log('Http on port', port);
  });
