const path = require('path');
const { spawn } = require('child_process');
const chokidar = require('chokidar');

const dataPath = path.resolve('./data');
const watcher = chokidar.watch(dataPath, {
  persistent: true,
  ignoreInitial: true,
});

watcher
  .on('add', (p) => {
    const proc = spawn('node', ['./syncData.js', 'up', p]);
    proc.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    proc.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    proc.on('close', (code) => {
      console.log('exited with code:', code);
    });
  })
  .on('change', (p) => {
    const proc = spawn('node', ['./syncData.js', 'up', p]);
    proc.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    proc.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    proc.on('close', (code) => {
      console.log('exited with code:', code);
    });
  });

console.log('Sync watching ', dataPath);
