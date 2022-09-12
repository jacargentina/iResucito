// Tomar el indice como referencia
// y mostrar cuales archivos no estan
// en el disco con el nombre indicado
var path = require('path');
var indexPath = path.resolve('../songs/index.json');
var SongsIndex = require(indexPath);
var fs = require('fs');

var fullpath = path.resolve('../songs/');
var localeFolders = fs.readdirSync(fullpath, { withFileTypes: true });
var localeSongs = {};
localeFolders.forEach((dirent) => {
  if (dirent.isDirectory()) {
    localeSongs[dirent.name] = fs.readdirSync(
      path.resolve(`../songs/${dirent.name}/`)
    );
  }
});

Object.entries(SongsIndex).forEach(([key, value]) => {
  Object.entries(value.files).forEach(([locale, name]) => {
    var fileName = `${name}.txt`;
    var found = localeSongs[locale].filter((n) => n === fileName);
    if (found.length === 0) {
      console.log(`Key ${key}, no se encontró ${fileName}`);
    }
    var dups = localeSongs[locale].filter(
      (n) => n.toLowerCase() === fileName.toLowerCase()
    );
    if (dups.length > 1) {
      console.log(`Key ${key}, duplicados!`, dups);
    }
  });
});

process.exit();
