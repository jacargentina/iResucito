// @flow
import { getPropertyLocale } from '../common';
const path = require('path');
const fs = require('fs');
require('colors');
const { execSync } = require('child_process');
const songsDir = path.resolve(__dirname, '../songs');
const indexPath = path.resolve(songsDir, 'index.json');
const patchesPath = path.resolve(songsDir, 'patches.json');
//$FlowFixMe
var SongsIndex = require(indexPath);
//$FlowFixMe
var SongsPatches = require(patchesPath);

//$FlowFixMe
const folders = fs.readdirSync(songsDir, { withFileTypes: true });
//$FlowFixMe
const onlyNames = folders.filter((d) => d.isDirectory()).map((d) => d.name);
const languageFolders = onlyNames.reduce((obj, item) => {
  obj[item] = item;
  return obj;
}, {});

const currentDate = Date.now();

const patchSongLogic = (songPatch, key) => {
  var report = {};
  report.key = key;
  try {
    if (!SongsIndex.hasOwnProperty(key)) {
      SongsIndex[key] = {
        key,
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
          report.createdFolder = loc;
          fs.mkdirSync(songDirectory);
        }
      } else {
        loc = existsLoc;
        songDirectory = path.join(songsDir, existsLoc);
      }
      report.locale = loc;

      var songFileName = path.join(songDirectory, `${file}.txt`);
      var newName = path.join(songDirectory, `${name}.txt`);
      if (newName !== songFileName) {
        report.rename = { original: file, new: name };
        execSync(`git mv --force "${songFileName}" "${newName}"`);
        Object.assign(songToPatch.files, { [loc]: name });
        songFileName = newName;
      } else if (songToPatch.files[loc] !== file) {
        report.rename = { original: songToPatch.files[loc], new: file };
        Object.assign(songToPatch.files, { [loc]: file });
      }
      if (lines) {
        report.updated = false;
        var text = null;
        if (fs.existsSync(songFileName)) {
          text = fs.readFileSync(songFileName, 'utf8');
          report.created = false;
        } else {
          report.created = true;
        }
        if (text !== lines) {
          fs.writeFileSync(songFileName, lines);
          if (!report.created) {
            report.updated = true;
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
          report.staged = { original: currStage, new: stage };
        }
      }

      // Guardar historia de cambios sólo si efectivamente se aplicaron cambios
      if (report.rename || report.created || report.updated || report.staged) {
        var patchInfo: SongPatchLogData = {
          date: date || currentDate,
          locale: report.locale,
          author: author,
          rename: report.rename,
          created: report.created,
          updated: report.updated,
          staged: report.staged,
        };
        if (!SongsPatches.hasOwnProperty(key)) {
          SongsPatches[key] = [];
        }
        var songPatches = SongsPatches[key];
        var found = songPatches.find((x) => x.date === date);
        if (!found) {
          songPatches.push(patchInfo);
        }
      }
    });
  } catch (err) {
    report.error = err.message;
  }
  return report;
};

const patchPath = path.resolve(
  __dirname,
  '../packages/webapp/data/SongsIndexPatch.json'
);
const json = fs.readFileSync(patchPath, 'utf8').normalize();
const patch = JSON.parse(json);
const finalReport = [];
Object.keys(patch).forEach((k) => {
  finalReport.push(patchSongLogic(patch[k], k));
});
fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
fs.writeFileSync(patchesPath, JSON.stringify(SongsPatches, null, '  '));
console.log(finalReport);
const date = new Date();
const formatDate =
  ('0' + date.getDate()).slice(-2) +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  date.getFullYear();
const bakPath = `${process.env.HOME}/SongsIndexPatch-${formatDate}.json`;
execSync(`mv "${patchPath}" "${bakPath}"`);
fs.writeFileSync(patchPath, JSON.stringify({}));
console.log(`Backup: ${bakPath}`);
