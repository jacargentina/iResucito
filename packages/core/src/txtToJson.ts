// Transformar la estructura de archivos de texto
// por un archivo unico en formato JSON
import * as fs from 'fs';

var langs = './assets/songs';
var items = fs.readdirSync(langs, { withFileTypes: true });
items.forEach((locale) => {
  if (locale.isDirectory()) {
    var sourcePath = `${langs}/${locale.name}/`;
    var targetPath = `${langs}/${locale.name}.json`;
    var cantos = fs.readdirSync(sourcePath);
    var result = {};
    cantos.forEach((current, index) => {
      var name = current.replace('.txt', '');
      result[index] = {
        name,
        source: fs.readFileSync(sourcePath + current, { encoding: 'utf-8' }),
      };
    });
    fs.writeFileSync(targetPath, JSON.stringify(result, null, 2));
    console.log(targetPath);
  }
});
