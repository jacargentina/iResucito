const path = require('path');
const cp = require('child_process');
const chokidar = require('chokidar');

const dataPath = path.resolve('./data');
const watcher = chokidar.watch(dataPath, {
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

console.log('Sync watching ', dataPath);
