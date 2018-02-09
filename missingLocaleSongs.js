const readline = require('readline');
var SongsIndex = require('./songs/index.json');

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
    console.log(`Cantos (es) sin locale ${locale}`);
    console.log(songs);
  }
});
