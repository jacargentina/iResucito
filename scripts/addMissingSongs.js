// @flow
import * as fs from 'fs';
import * as path from 'path';
import FolderSongs from '../FolderSongs';
import { readLocalePatch } from '../packages/webapp/common';
const { execSync } = require('child_process');
const merge = require('deepmerge');
const inScripts = path.basename(process.cwd()) === path.basename(__dirname);
const songsDir = inScripts ? '../songs' : './songs';

FolderSongs.basePath = path.resolve('./songs');

async function run(locale: string, dirty) {
  const patch = await readLocalePatch();
  var songs = FolderSongs.getSongsMeta(locale, patch);

  var localeSongs = await FolderSongs.readLocaleSongs(locale);
  var missingOnIndex = localeSongs.filter((locSong) => {
    const sameCaseFound = songs.find((s) => s.files[locale] === locSong.nombre);
    if (!sameCaseFound) {
      const lowerCaseFound = songs.find(
        (s) =>
          s.files[locale] &&
          s.files[locale].toLowerCase() === locSong.nombre.toLowerCase()
      );

      if (!lowerCaseFound) {
        return locSong;
      }
      if (!dirty) {
        var source = path.join(songsDir, locale, `${locSong.nombre}.txt`);
        var target = path.join(
          songsDir,
          locale,
          `${lowerCaseFound.files[locale]}.txt`
        );
        execSync(`git mv --force "${source}" "${target}"`);
      } else {
        console.log('Disk case must be fixed!');
        console.log({
          indexIs: lowerCaseFound.files[locale],
          diskIs: locSong.nombre,
        });
      }
    }
  });
  if (missingOnIndex.length > 0) {
    const songMaxKey = songs.reduce((prev, next) => {
      if (Number(prev.key) > Number(next.key)) {
        return prev;
      }
      return next;
    }, songs[0]);
    var baseKey = Number(songMaxKey.key) + 1;
    var addtoIndex = {};
    missingOnIndex.forEach((m, i) => {
      addtoIndex[baseKey + i] = {
        stage: 'precatechumenate',
        files: {
          [locale]: m.nombre,
        },
      };
    });

    var index = fs.readFileSync('./songs/index.json', 'utf8');
    var obj = JSON.parse(index);
    var newIndex = merge(obj, addtoIndex);
    if (!dirty) {
      fs.writeFileSync(
        './songs/index.json',
        JSON.stringify(newIndex, null, ' ')
      );
      console.log(
        `Fixed index with ${Object.keys(addtoIndex).length} new songs`
      );
    } else {
      console.log(addtoIndex);
    }
  } else {
    console.log('No changes');
  }
}

var program = require('commander');

program
  .version('1.0')
  .description('Add files detected on locale folder to the index')
  .option('-l, --locale [locale]', 'Locale to use')
  .option('--dirty', 'Dirty run');

if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
  var locale = program.locale;
  var dirty = program.dirty;
  run(locale, dirty);
}
