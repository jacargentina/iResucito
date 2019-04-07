// Para un locale indicado,
// ver cuales archivos del español (la referencia principal)
// no estan en ese locale en el indice
const readline = require('readline');
var path = require('path');
var indexPath = path.resolve('../songs/index.json');
var SongsIndex = require(indexPath);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Cual locale? ', locale => {
  if (locale !== '') {
    var songs = Object.keys(SongsIndex);
    songs = songs.filter(key => {
      return !SongsIndex[key].files.hasOwnProperty(locale);
    });
    songs = songs.map(key => {
      return SongsIndex[key].files['es'];
    });
    songs.sort();
    /* eslint-disable */
    console.log(`Cantos (es) sin locale ${locale}`);
    console.log(songs);
    process.exit();
  }
});
