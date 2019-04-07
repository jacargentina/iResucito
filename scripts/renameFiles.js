// Cuando lo nombres de archivos ya estan en el indice
// pero los nombres difieren en el disco en la capitalizacion
// usar este script
var path = require('path');
var indexPath = path.resolve('../songs/index.json');
var SongsIndex = require(indexPath);
var fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const keys = Object.keys(SongsIndex);

rl.question('Cual locale? ', locale => {
  var sourcePath = `../songs/${locale}/`;
  var cantos = fs.readdirSync(sourcePath);

  cantos.forEach(current => {
    var name = current.replace('.txt', '');
    var fileInIndex = keys.find(
      k =>
        SongsIndex[k].files[locale] &&
        SongsIndex[k].files[locale].toLowerCase() ===
          current.toLowerCase().replace('.txt', '')
    );
    if (fileInIndex) {
      const indexName = SongsIndex[fileInIndex].files[locale];
      if (indexName !== name) {
        console.log({
          key: fileInIndex,
          index: indexName,
          disk: name
        });
        var oldPath = path.resolve(`../songs/${locale}/${name}.txt`);
        var newPath = path.resolve(`../songs/${locale}/${indexName}.txt`);
        execSync(`git mv '${oldPath}' '${newPath}'`);
      }
    }
  });

  process.exit();
});
