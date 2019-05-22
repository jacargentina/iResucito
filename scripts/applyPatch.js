// @flow
import { getPropertyLocale } from '../src/common';
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const inScripts = path.basename(process.cwd()) == path.basename(__dirname);
const songsDir = inScripts ? '../songs' : './songs';
const indexPath = path.resolve(songsDir, 'index.json');
const patchesPath = path.resolve(songsDir, 'patches.json');
const SongsIndex = require(indexPath);
const SongsPatches = require(patchesPath);

const languageFolders = fs
  .readdirSync(songsDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .reduce((obj, item) => {
    obj[item] = item;
    return obj;
  }, {});

if (process.argv.length == 3) {
  var patchPath = process.argv[2];
  if (patchPath !== '') {
    var patchStat = fs.statSync(patchPath);
    var json = fs.readFileSync(patchPath, 'utf8').normalize();
    var patch = JSON.parse(json);
    var finalReport = [];
    Object.keys(patch).forEach(key => {
      var songPatch: SongPatch = patch[key];
      var report = {};
      report.key = key;
      try {
        var songToPatch = SongsIndex[key];
        Object.keys(songPatch).forEach(rawLoc => {
          var item: SongPatchData = songPatch[rawLoc];
          var loc = '';
          var { author, file, rename, lines } = item;
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
          var newName = rename
            ? path.join(songDirectory, `${rename}.txt`)
            : null;
          if (newName && !fs.existsSync(songFileName)) {
            report.renameNotPossible = `no existe ${songFileName}`;
          } else if (newName && newName !== songFileName) {
            report.rename = { original: songFileName, new: newName };
            execSync(`git mv --force "${songFileName}" "${newName}"`);
            Object.assign(songToPatch.files, { [loc]: rename });
          } else if (songToPatch.files[loc] !== file) {
            report.assign = {
              orginal: songToPatch.files[loc]
                ? songToPatch.files[loc]
                : 'notFound',
              new: file
            };
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

          // Guardar historia de cambios
          var patchInfo = {};
          patchInfo.date = patchStat.mtime;
          patchInfo.author = author || 'anonymous';
          patchInfo.rename = report.rename;
          patchInfo.created = report.created;
          patchInfo.updated = report.updated;

          var songPatches = SongsPatches[key];
          if (songPatches) {
            var found = songPatches.find(x => x.date === patchStat.mtime);
            if (found.length === 0) {
              songPatches.push(patchInfo);
            }
          } else {
            songPatches = [];
            songPatches.push(patchInfo);
          }
        });
      } catch (err) {
        report.error = err.message;
      }

      finalReport.push(report);
    });
    fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
    fs.writeFileSync(patchesPath, JSON.stringify(SongsPatches, null, ' '));
    console.log(finalReport);
  }
} else {
  console.log('node applyPatch Path/To/SongsIndexPatch.json');
}
