var SongsIndex = require('../songs/index.json');
var fs = require('fs');

String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

Object.entries(SongsIndex).forEach(([key, value]) => {
  if (value.files['pt']) {
    var original = value.files['pt'];
    var titulo = original.substr(0, original.indexOf('-'));
    var fuente = original.substr(original.indexOf('-') + 1);

    titulo = titulo.toLowerCase();
    titulo = titulo.replaceAt(0, titulo[0].toUpperCase());

    var renameTo = titulo + '-' + fuente;

    fs.renameSync(`../songs/pt/${original}.txt`, `../songs/pt/${renameTo}.txt`);

    value.files['pt'] = renameTo;

    console.log({ original, renameTo });
  }
});
console.log(SongsIndex);
fs.writeFileSync('../songs/index.json', JSON.stringify(SongsIndex, null, ' '));
