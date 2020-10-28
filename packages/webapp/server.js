const http = require('http');
const next = require('next');

require('./sync');

const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http
    .createServer((req, res) => {
      handle(req, res);
    })
    .listen(process.env.PORT || 3000, (err) => {
      if (err) throw err;
      console.log('> Ready');
    });
});
