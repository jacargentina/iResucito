// Tanto el indice como los archivos
// deben seguir el formato "Nombre del canto - Fuente.txt"
// Para corregir la capitalizacion tanto del indice como del archivo
// usar este script
const readline = require('readline');
var path = require('path');
var indexPath = path.resolve('../songs/index.json');
var SongsIndex = require(indexPath);
var fs = require('fs');

String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Cual locale? ', locale => {
  Object.entries(SongsIndex).forEach(([key, value]) => {
    if (value.files[locale]) {
      var original = value.files[locale];
      var titulo = original.substr(0, original.indexOf('-'));
      var fuente = original.substr(original.indexOf('-') + 1);

      titulo = titulo.toLowerCase();
      titulo = titulo.replaceAt(0, titulo[0].toUpperCase());

      var renameTo = titulo + '-' + fuente;

      var oldPath = path.resolve(`../songs/pt/${original}.txt`);
      var newPath = path.resolve(`../songs/pt/${renameTo}.txt`);
      fs.renameSync(oldPath, newPath);
      value.files[locale] = renameTo;
    }
  });
  fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
});
