// @flow
import * as path from 'path';
import * as cp from 'child_process';
import chokidar from 'chokidar';
import { dataPath } from './common';

const watcher = chokidar.watch(dataPath, {
  persistent: true,
  ignoreInitial: true,
});

const syncScriptPath = path.resolve('./packages/webapp');

watcher
  .on('add', (p) => {
    cp.spawn('node', ['./syncData.js', 'up', p], {
      cwd: syncScriptPath,
    });
  })
  .on('change', (p) => {
    cp.spawn('node', ['./syncData.js', 'up', p], {
      cwd: syncScriptPath,
    });
  });
