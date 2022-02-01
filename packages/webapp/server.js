const { createRequestHandler } = require('@remix-run/express');

require('./sync');

const app = express();
app.all('*', createRequestHandler({ build: require('./build') }));
app.listen(process.env.PORT || 3000, (err) => {
  if (err) throw err;
  console.log('> Ready');
});
