// @flow
import * as path from 'path';
import * as cp from 'child_process';
import chokidar from 'chokidar';
import { dataPath } from './common';

const watcher = chokidar.watch(dataPath, {
  persistent: true,
  ignoreInitial: true
});

const syncScriptPath = path.resolve('./web/server');

watcher
  .on('add', path => {
    cp.spawn('node', ['./syncData.js', 'up', path], {
      cwd: syncScriptPath
    });
  })
  .on('change', path => {
    cp.spawn('node', ['./syncData.js', 'up', path], {
      cwd: syncScriptPath
    });
  });

