// @flow
if (!process.env.NODE_ENV) {
  throw new Error('Establecer un valor para NODE_ENV');
}
if (!process.env.PORT) {
  throw new Error('Establecer un valor para PORT');
}

import * as path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import auth from './auth';
import songs from './songs';

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

if (process.env.NODE_ENV == 'production') {
  require('./sync');
}

auth(server);
songs(server);

// Start server
const port = process.env.PORT || 3000;
require('http')
  .createServer(server)
  .listen(port, function() {
    console.log('Http on port', port);
  });
