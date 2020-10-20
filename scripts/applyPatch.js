// @flow
import { getPropertyLocale } from '../common';
const path = require('path');
const fs = require('fs');
require('colors');
//const jsdiff = require('diff');
const { execSync } = require('child_process');
const inScripts = path.basename(process.cwd()) === path.basename(__dirname);
const songsDir = inScripts ? '../songs' : './songs';
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

const patchSongLogic = (songPatch, key, dirty) => {
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
      var loc = rawLoc;
      var { author, date, file, name, lines, stage } = item;
      name = name.trim();
      if (!file) {
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
          if (!dirty) {
            fs.mkdirSync(songDirectory);
          } else {
            console.log('crea carpeta', songDirectory);
          }
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
        if (!dirty) {
          execSync(`git mv --force "${songFileName}" "${newName}"`);
        }
        Object.assign(songToPatch.files, { [loc]: name });
        songFileName = newName;
      } else if (songToPatch.files[loc] !== file) {
        if (songToPatch.files[loc]) {
          report.rename = { original: songToPatch.files[loc], new: file };
        } else {
          report.linked = { new: file };
        }
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
          if (!dirty) {
            fs.writeFileSync(songFileName, lines);
          }
          if (!report.created) {
            report.updated = true;
            // var diff = jsdiff.diffChars(text, lines);
            // diff.forEach(part => {
            //   // green for additions, red for deletions
            //   // grey for common parts
            //   var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
            //   process.stderr.write(part.value[color]);
            // });
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

      // Guardar historia de cambios
      var patchInfo: SongPatchLogData = {
        date: date || currentDate,
        locale: report.locale,
        author: author || 'anonymous',
        rename: report.rename,
        linked: report.linked,
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
    });
  } catch (err) {
    report.error = err.message;
  }
  return report;
};

var program = require('commander');

program
  .version('1.0')
  .description('Apply patches')
  .option('-f, --file [path]', 'Patch to use')
  .option('--dirty', 'Dirty run')
  .option(
    '-k, --key [value]',
    'Song key. Defaults to patch all songs',
    parseInt
  );

if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
  var file = program.file;
  if (!file) {
    throw 'File not provided.';
  }
  var key = program.key;
  var dirty = program.dirty;
  var json = fs.readFileSync(file, 'utf8').normalize();
  var patch = JSON.parse(json);
  var finalReport = [];
  if (key) {
    finalReport.push(patchSongLogic(patch[key], key, dirty));
  } else {
    Object.keys(patch).forEach((k) => {
      finalReport.push(patchSongLogic(patch[k], k, dirty));
    });
  }
  if (!dirty) {
    fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
    fs.writeFileSync(patchesPath, JSON.stringify(SongsPatches, null, '  '));
  }
  console.log(finalReport);
}
