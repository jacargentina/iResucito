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
      var songToPatch = SongsIndex[key];
      Object.entries(value).forEach(([locale, item]) => {
        const { file, rename, lines } = item;
        var oldName = path.resolve(`../songs/${locale}/${file}.txt`);
        var newName = rename
          ? path.resolve(`../songs/${locale}/${rename}.txt`)
          : null;
        var existeNuevo = newName && fs.existsSync(newName);
        if (existeNuevo || !fs.existsSync(oldName)) {
          console.log(`Key ${key}, renombrado previamente.`);
        } else if (newName) {
          execSync(`git mv --force "${oldName}" "${newName}"`);
          Object.assign(songToPatch.files, { [locale]: rename });
        } else {
          Object.assign(songToPatch.files, { [locale]: file });
        }
        if (lines) {
          const theSong = songToPatch.files[locale];
          const songPath = path.resolve(`../songs/${locale}/${theSong}.txt`);
          const text = fs.readFileSync(songPath, 'utf8');
          if (text === lines) {
            console.log(`Key ${key}, texto no aplicable.`);
          } else {
            fs.writeFileSync(songPath, lines);
            console.log(`Key ${key}, aplicado texto.`);
          }
        }
      });
    });
    fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
  }
} else {
  console.log('node applyPatch Path/To/SongsIndexPatch.json');
}
