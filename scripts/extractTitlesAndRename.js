// Extraer de los archivos dentro del locale
// la primer linea que es el titulo, formatearla
// y renombrar el archivo de forma acorde
const readline = require('readline');
var path = require('path');
var fs = require('fs');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

rl.question('Cual locale? ', locale => {
  rl.question('Solo mostrar? ', onlyShow => {
    var sourcePath = `../songs/${locale}/originals`;
    var archivos = fs.readdirSync(sourcePath);

    archivos.forEach(filename => {
      var oldPath = path.resolve(`${sourcePath}/${filename}`);
      var content = fs.readFileSync(oldPath, 'utf8');
      var titulo = content
        .split('\n')[0]
        .replace(/["*]/g, '')
        .replace(/\//g, '-')
        .trim()
        .toLowerCase();

      titulo =
        titulo.length > 3
          ? titulo
          : 'Buscar titulo ' + filename.replace('.txt', '');

      renameTo = titulo.replace(/  /g, ' ');
      renameTo = renameTo.replace('(*)', '');
      var parts = renameTo.split('-');
      if (parts.length > 1) {
        const [p1, p2] = parts;

        if (p1.toLowerCase().includes('psalm')) {
          var fuente = p1.trim().replaceAt(0, p1.trim()[0].toUpperCase());
          renameTo = p2.trim() + ' - ' + fuente;
        }
      }

      renameTo = renameTo.replaceAt(0, renameTo[0].toUpperCase());

      var newPath = path.resolve(`../songs/${locale}/${renameTo}.txt`);
      var cmd = `mv "${oldPath}" "${newPath}"`;
      if (onlyShow == 's') {
        console.log(cmd);
      } else {
        execSync(`mv "${oldPath}" "${newPath}"`);
      }
    });

    process.exit();
  });
});
