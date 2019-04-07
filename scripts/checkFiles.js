var path = require('path');
var indexPath = path.resolve('../songs/index.json');
var SongsIndex = require(indexPath);
var fs = require('fs');

Object.entries(SongsIndex).forEach(([key, value]) => {
  Object.entries(value.files).forEach(([locale, name]) => {
    var fullpath = path.resolve(`../songs/${locale}/${name}.txt`);
    if (!fs.existsSync(fullpath)) {
      console.log(fullpath);
    }
  });
});

process.exit();
