// Para un locale elegido, ir agregando al indice
// los archivos que estan presentes en el disco
// pero aun no estan enlazados
const readline = require('readline');
var path = require('path');
var indexPath = path.resolve('../songs/index.json');
var SongsIndex = require(indexPath);
var fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Cual locale? ', (locale) => {
  var sourcePath = `../songs/${locale}/`;
  var cantos = fs.readdirSync(sourcePath);
  var i = 0;

  /* eslint-disable no-console */
  var keys = Object.keys(SongsIndex);
  var sin_locale = keys.filter(
    (k) => !SongsIndex[k].files.hasOwnProperty(locale)
  );
  sin_locale.forEach((k) => {
    console.log(`${k}: ${SongsIndex[k].files.es}`);
  });
  console.log(`${sin_locale.length} sin ${locale}; ${cantos.length} archivos`);

  function processNext() {
    var current = cantos[i];
    if (current == undefined) {
      console.log('Hecho!');
      process.exit();
    }
    var currentName = current.replace('.txt', '');
    var fileInIndex = keys.find(
      (k) => SongsIndex[k].files[locale] === currentName
    );
    if (fileInIndex) {
      i++;
      processNext();
    } else {
      console.log(current);
      rl.question('Cual es la clave? ', (answer) => {
        if (answer !== '') {
          if (!SongsIndex[answer].files[locale]) {
            SongsIndex[answer].files[locale] = currentName;
            fs.writeFileSync(indexPath, JSON.stringify(SongsIndex, null, ' '));
            i++;
            processNext();
          } else {
            console.log('Clave ya asignada.');
            processNext();
          }
        } else {
          i++;
          processNext();
        }
      });
    }
  }

  processNext();
});
