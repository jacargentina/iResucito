// @flow
import { getPropertyLocale } from '../common';
const path = require('path');
const fs = require('fs');
require('colors');
const jsdiff = require('diff');
const { execSync } = require('child_process');
const inScripts = path.basename(process.cwd()) == path.basename(__dirname);
const songsDir = inScripts ? '../songs' : './songs';
const indexPath = path.resolve(songsDir, 'index.json');
const patchesPath = path.resolve(songsDir, 'patches.json');
//$FlowFixMe
const SongsIndex = require(indexPath);
//$FlowFixMe
const SongsPatches = require(patchesPath);

//$FlowFixMe
const folders = fs.readdirSync(songsDir, { withFileTypes: true });
//$FlowFixMe
const onlyNames = folders.filter(d => d.isDirectory()).map(d => d.name);
const languageFolders = onlyNames.reduce((obj, item) => {
  obj[item] = item;
  return obj;
}, {});

const patchSongLogic = (songPatch, key) => {
  var report = {};
  report.key = key;
  try {
    var songToPatch = SongsIndex[key];
    if (!songToPatch) {
      songToPatch = { key, files: {}, stage: 'precatechumenate', stages: {} };
    }
    Object.keys(songPatch).forEach(rawLoc => {
      var item: SongPatchData = songPatch[rawLoc];
      var loc = '';
      var { author, date, file, rename, lines, stage } = item;
      if (rename) {
        rename = rename.trim();
      }
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
          if (rename) {
            // Usar el nombre de renombrado para crear archivo
            file = rename;
            rename = undefined;
          } else {
            // El archivo aun no existe en el idioma
            // crear archivo con el nombre del español
            file = songToPatch.files['es'];
          }
        }
      }

      var songDirectory = null;
      // Decidir lenguaje segun carpetas de idioma disponible
      var existsLoc = getPropertyLocale(languageFolders, loc);
      if (!existsLoc) {
        // No existe carpeta, crearla
        report.createdFolder = loc;
        songDirectory = path.join(songsDir, loc);
        fs.mkdirSync(songDirectory);
      } else {
        loc = existsLoc;
        songDirectory = path.join(songsDir, existsLoc);
      }

      var songFileName = path.join(songDirectory, `${file}.txt`);
      var newName = rename ? path.join(songDirectory, `${rename}.txt`) : null;
      if (newName && !fs.existsSync(songFileName)) {
        report.renameNotPossible = `no existe ${songFileName}`;
      } else if (newName && newName !== songFileName) {
        report.rename = { original: file, new: rename };
        execSync(`git mv --force "${songFileName}" "${newName}"`);
        Object.assign(songToPatch.files, { [loc]: rename });
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
          fs.writeFileSync(songFileName, lines);
          if (!report.created) {
            // var diff = jsdiff.diffChars(text, lines);
            // diff.forEach(part => {
            //   // green for additions, red for deletions
            //   // grey for common parts
            //   var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
            //   process.stderr.write(part.value[color]);
            // });
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

      if (
        report.rename ||
        report.linked ||
        report.created ||
        report.updated ||
        report.staged
      ) {
        // Guardar historia de cambios
        var patchInfo: SongPatchLogData = {
          locale: loc,
          date: date,
          author: author || 'anonymous',
          rename: report.rename,
          linked: report.linked,
          created: report.created,
          updated: report.updated,
          staged: report.staged
        };

        var songPatches = SongsPatches[key];
        if (songPatches) {
          var found = songPatches.find(x => x.date === date);
          if (!found) {
            songPatches.push(patchInfo);
          }
        } else {
          songPatches = [];
          songPatches.push(patchInfo);
          SongsPatches[key] = songPatches;
        }
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
  .description('Generate PDF for a given song')
  .option('-f, --file [path]', 'Patch to use')
  .option(
    '-k, --key [value]',
    'Song key. Defaults to generate all songs',
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
  var json = fs.readFileSync(file, 'utf8').normalize();
  var patch = JSON.parse(json);
  var finalReport = [];
  if (key) {
    var res = patchSongLogic(patch[key], key);
    finalReport.push(res);
  } else {
    Object.keys(patch).forEach(k => {
      var res = patchSongLogic(patch[k], k);
      finalReport.push(res);
    });
  }
  fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
  fs.writeFileSync(patchesPath, JSON.stringify(SongsPatches, null, '  '));
  console.log(finalReport);
}
