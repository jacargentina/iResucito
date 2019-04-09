var path = require('path');
const { execSync } = require('child_process');
var indexPath = path.resolve('../songs/index.json');
var SongsIndex = require(indexPath);
var fs = require('fs');

if (process.argv.length == 3) {
  var path = process.argv[2];
  if (path !== '') {
    var json = fs.readFileSync(path, 'utf8').normalize();
    var patch = JSON.parse(json);
    Object.entries(patch).forEach(([key, value]) => {
      var songToPatch = SongsIndex[key];
      Object.entries(value).foreach(([locale, item]) => {
        const { file, rename } = item;
        if (rename) {
          var oldName = path.resolve(`../songs/${locale}/${file}.txt`);
          var newName = path.resolve(`../songs/${locale}/${rename}.txt`);
          execSync(`git mv "${oldName}" "${newName}"`);
        }
        Object.assign(songToPatch.files, { [locale]: file });
      });
    });
    console.log(SongsIndex);
    fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
  }
} else {
  console.log('node applyPatch Path/To/SongsIndexPatch.json');
}
