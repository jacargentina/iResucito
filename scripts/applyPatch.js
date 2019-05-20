import { getPropertyLocale } from '../src/common';
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const inScripts = path.basename(process.cwd()) == path.basename(__dirname);
const songsDir = inScripts ? '../songs' : './songs';
const indexPath = path.resolve(songsDir, 'index.json');
const SongsIndex = require(indexPath);

if (process.argv.length == 3) {
  var patchPath = process.argv[2];
  if (patchPath !== '') {
    var json = fs.readFileSync(patchPath, 'utf8').normalize();
    var patch = JSON.parse(json);
    Object.entries(patch).forEach(([key, songPatch]) => {
      try {
        var songToPatch = SongsIndex[key];
        Object.entries(songPatch).forEach(([rawLoc, item]) => {
          var loc;
          var { file, rename, lines } = item;
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
          var songDirectory = path.join(songsDir, loc);
          var songFileName = path.join(songDirectory, `${file}.txt`);
          var newName = rename
            ? path.join(songDirectory, `${rename}.txt`)
            : null;
          if (!fs.existsSync(songDirectory)) {
            console.log(
              `Key ${key}, carpeta de locale ${loc} no existe. Creando!`
            );
            fs.mkdirSync(songDirectory);
          }
          if (newName && !fs.existsSync(songFileName)) {
            console.log(
              `Key ${key}, no existe ${songFileName}, no se puede renombrar`
            );
          } else if (newName && newName !== songFileName) {
            console.log(`Key ${key}, renombrando`);
            execSync(`git mv --force "${songFileName}" "${newName}"`);
            Object.assign(songToPatch.files, { [loc]: rename });
          } else {
            console.log(`Key ${key}, enlazando ${file}`);
            Object.assign(songToPatch.files, { [loc]: file });
          }
          if (lines) {
            var text = null;
            if (fs.existsSync(songFileName)) {
              text = fs.readFileSync(songFileName, 'utf8');
              console.log(`Key ${key}, cargado texto existente`);
            } else {
              console.log(`Key ${key}, creando archivo nuevo`);
            }
            if (text === lines) {
              console.log(`Key ${key}, texto no aplicable`);
            } else {
              fs.writeFileSync(songFileName, lines);
              console.log(`Key ${key}, texto guardado`);
            }
          }
        });
      } catch (err) {
        console.log(`Key ${key}`, err);
      }
    });
    fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
  }
} else {
  console.log('node applyPatch Path/To/SongsIndexPatch.json');
}
