const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var sourcePath = './Salmos/it/originals/';
var targetPath = './Salmos/it/';
var indice = require('./Indice.json');
var fs = require('fs');
var cantos = fs.readdirSync(sourcePath);
var i = 0;

/* eslint-disable no-console */
var keys = Object.keys(indice);
var sin_locale = keys.filter(
  k => !Object.hasOwnProperty(indice[k].files, 'it')
);
sin_locale.forEach(k => {
  console.log(`${k}: ${indice[k].files.es}`);
});
console.log(`${sin_locale.length} sin it; ${cantos.length} archivos`);

function processNext() {
  var current = cantos[i];
  console.log(current);

  rl.question('Cual es la clave? ', answer => {
    if (answer !== '') {
      if (!indice[answer].files.it) {
        indice[answer].files.it = current.replace('.txt', '');
        fs.copyFileSync(`${sourcePath}${current}`, `${targetPath}${current}`);
        fs.unlinkSync(`${sourcePath}${current}`);
        fs.writeFileSync('./Indice.json', JSON.stringify(indice, 2, ' '));
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

processNext();
