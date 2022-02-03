const express = require('express');
const { createRequestHandler } = require('@remix-run/express');

require('./sync');

const app = express();
app.use(express.static('public', { immutable: false, maxAge: '1h' }));
app.use(express.static('public/build', { immutable: true, maxAge: '1y' }));
app.all('*', createRequestHandler({ build: require('./build') }));
app.listen(process.env.PORT || 3000, (err) => {
  if (err) throw err;
  console.log('> Ready');
});
