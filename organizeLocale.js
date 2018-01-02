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

console.log('Claves sin IT');
var keys = Object.keys(indice);
var sin_locale = keys.filter(
  k => !Object.hasOwnProperty(indice[k].files, 'it')
);
sin_locale.forEach(k => {
  console.log(`${k}: ${indice[k].files.es}`);
});

function processNext() {
  var current = cantos[i];
  console.log(`Archivo ${current}`);

  rl.question(`Cual es la clave? `, answer => {
    if (answer !== '') {
      indice[answer].files.it = current;
      fs.copyFileSync(`${sourcePath}${current}`, `${targetPath}${current}`);
      fs.unlinkSync(`${sourcePath}${current}`);
    }
    i++;
    processNext();
  });
}

processNext();
