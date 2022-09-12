import {
  getPropertyLocale,
  getPatchStats,
  SongsData,
  SongsChanges,
  SongPatch,
  SongPatchData,
  SongChange,
} from '@iresucito/core/common';
import path from 'path';
import util from 'util';
import fs from 'fs';
import { execSync } from 'child_process';
require('colors');
import SongsIndexRaw from '@iresucito/core/songs/index.json';
import SongsHistoryRaw from '@iresucito/core/songs/patches.json';

const SongsIndex: SongsData = SongsIndexRaw;

var SongsHistory: SongsChanges = SongsHistoryRaw;

const songsDir = path.resolve(__dirname, '../songs');
const folders = fs.readdirSync(songsDir, { withFileTypes: true });

const onlyNames = folders.filter((d) => d.isDirectory()).map((d) => d.name);
const languageFolders = onlyNames.reduce((obj: any, item) => {
  if (typeof item === 'string') {
    obj[item] = item;
  }
  return obj;
}, {});

const currentDate = Date.now();

const patchSongLogic = (songPatch: SongPatch, key: string) => {
  try {
    if (!SongsIndex.hasOwnProperty(key)) {
      SongsIndex[key] = {
        files: {},
        stage: 'precatechumenate',
        stages: {},
      };
    }
    var songToPatch = SongsIndex[key];
    Object.keys(songPatch).forEach((rawLoc) => {
      var item: SongPatchData = songPatch[rawLoc];
      var file;
      var loc = rawLoc;
      var { author, date, name, lines, stage } = item;
      name = name.trim();
      loc = getPropertyLocale(songToPatch.files, rawLoc);
      if (loc) {
        // Buscar si está el nombre en el indice
        file = songToPatch.files[loc];
      } else {
        // Tomar loc desde parche (archivo nuevo para un idioma)
        loc = rawLoc;
      }
      if (!file) {
        file = name;
      }

      if (!loc) {
        throw new Error('No se pudo determinar localizacion');
      }

      var songDirectory = null;
      // Decidir lenguaje segun carpetas de idioma disponible
      var existsLoc = getPropertyLocale(languageFolders, loc);
      if (!existsLoc) {
        // Si aun no existe carpeta, crearla
        songDirectory = path.join(songsDir, loc);
        if (!fs.existsSync(songDirectory)) {
          fs.mkdirSync(songDirectory);
          console.log('Created folder:', loc);
        }
      } else {
        loc = existsLoc;
        songDirectory = path.join(songsDir, existsLoc);
      }

      var rename: { original: string; new: string } | undefined = undefined;
      var staged: { original: string; new: string } | undefined = undefined;
      var updated: boolean = false;
      var created: boolean = false;

      var songFileName = path.join(songDirectory, `${file}.txt`);
      var newName = path.join(songDirectory, `${name}.txt`);
      if (newName !== songFileName) {
        rename = { original: file, new: name };
        execSync(`git mv --force "${songFileName}" "${newName}"`);
        Object.assign(songToPatch.files, { [loc]: name });
        songFileName = newName;
      } else if (songToPatch.files[loc] !== file) {
        rename = { original: songToPatch.files[loc], new: file };
        Object.assign(songToPatch.files, { [loc]: file });
      }
      if (lines) {
        updated = false;
        var text = null;
        if (fs.existsSync(songFileName)) {
          text = fs.readFileSync(songFileName, 'utf8');
          created = false;
        } else {
          created = true;
        }
        if (text !== lines) {
          fs.writeFileSync(songFileName, lines);
          if (!created) {
            updated = true;
          }
        }
      }

      if (stage) {
        const currStage =
          songToPatch.stages && songToPatch.stages.hasOwnProperty(loc)
            ? songToPatch.stages[loc]
            : songToPatch.stage;
        if (currStage !== stage) {
          if (!songToPatch.stages) {
            songToPatch.stages = {};
          }
          Object.assign(songToPatch.stages, { [loc]: stage });
          staged = { original: currStage, new: stage };
        }
      }

      // Guardar historia de cambios sólo si efectivamente se aplicaron cambios
      if (rename || created || updated || staged) {
        var patchInfo: SongChange = {
          date: date || currentDate,
          locale: loc,
          author: author,
          rename: rename,
          created: created,
          updated: updated,
          staged: staged,
        };
        if (!SongsHistory.hasOwnProperty(key)) {
          SongsHistory[key] = [];
        }
        var songPatches = SongsHistory[key];
        var found = songPatches.find((x) => x.date === date);
        if (!found) {
          songPatches.push(patchInfo);
        }
      }
    });
  } catch (err: any) {
    console.log(err.message);
  }
};

const patchPath = path.resolve(
  __dirname,
  '../webapp/data/SongsIndexPatch.json'
);
const json = fs.readFileSync(patchPath, 'utf8').normalize();
const patch = JSON.parse(json);
const stats = getPatchStats(patch);
Object.keys(patch).forEach((k) => {
  patchSongLogic(patch[k], k);
});
fs.writeFileSync('../songs/index.json', JSON.stringify(SongsIndex, null, ' '));
fs.writeFileSync(
  '../songs/patches.json',
  JSON.stringify(SongsHistory, null, '  ')
);
console.log(util.inspect(stats, { depth: 10 }));
const date = new Date();
const formatDate =
  ('0' + date.getDate()).slice(-2) +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  date.getFullYear();
const home = process.env.HOME ?? '.';
const bakPath = `${home}/SongsIndexPatch-${formatDate}.json`;
execSync(`mv "${patchPath}" "${bakPath}"`);
fs.writeFileSync(patchPath, JSON.stringify({}));
console.log(`Backup: ${bakPath}`);
