var path = require('path');
const { execSync } = require('child_process');
var indexPath = path.resolve('../songs/index.json');
var SongsIndex = require(indexPath);
var fs = require('fs');

if (process.argv.length == 3) {
  var patchPath = process.argv[2];
  if (patchPath !== '') {
    var json = fs.readFileSync(patchPath, 'utf8').normalize();
    var patch = JSON.parse(json);
    Object.entries(patch).forEach(([key, value]) => {
      try {
        var songToPatch = SongsIndex[key];
        Object.entries(value).forEach(([locale, item]) => {
          var { file, rename, lines } = item;
          if (rename) {
            rename = rename.trim();
          }
          if (!file) {
            // Buscar si está el nombre en el  indice
            file = songToPatch.files[locale];
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
          var songFileName = path.resolve(`../songs/${locale}/${file}.txt`);
          var newName = rename
            ? path.resolve(`../songs/${locale}/${rename}.txt`)
            : null;
          if (newName && !fs.existsSync(songFileName)) {
            console.log(
              `Key ${key}, no existe ${songFileName}, no se puede renombrar`
            );
          } else if (newName && newName !== songFileName) {
            console.log(`Key ${key}, renombrando`);
            execSync(`git mv --force "${songFileName}" "${newName}"`);
            Object.assign(songToPatch.files, { [locale]: rename });
          } else {
            console.log(`Key ${key}, enlazando ${file}`);
            Object.assign(songToPatch.files, { [locale]: file });
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
