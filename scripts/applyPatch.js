var path = require('path');
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
      Object.assign(songToPatch.files, value);
    });
    console.log(SongsIndex);
    fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
  }
} else {
  console.log('node applyPatch Path/To/SongsIndexPatch.json');
}
