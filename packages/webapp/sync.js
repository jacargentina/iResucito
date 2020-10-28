const path = require('path');
const cp = require('child_process');
const chokidar = require('chokidar');

const watcher = chokidar.watch(path.resolve('./data'), {
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on('add', (p) => {
    cp.spawn('node', ['./syncData.js', 'up', p]);
  })
  .on('change', (p) => {
    cp.spawn('node', ['./syncData.js', 'up', p]);
  });

console.log('Sync watching');
