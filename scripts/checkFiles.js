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
localeFolders.forEach(dirent => {
  if (dirent.isDirectory()) {
    localeSongs[dirent.name] = fs.readdirSync(
      path.resolve(`../songs/${dirent.name}/`)
    );
  }
});

Object.entries(SongsIndex).forEach(([key, value]) => {
  Object.entries(value.files).forEach(([locale, name]) => {
    var fileName = `${name}.txt`;
    var found = localeSongs[locale].find(n => n === fileName);
    if (!found) {
      console.log(`Key ${key}, no se encontró ${fileName}`);
    }
  });
});

process.exit();
