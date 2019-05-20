const fs = require('fs');
const TJO = require('translate-json-object')();
var program = require('commander');

program
  .version('1.0')
  .description('Generate translation for a given language')
  .option('-l, --locale [locale]', 'Target locale for traduction');

if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
  var locale = program.locale;
  if (!locale) {
    throw 'Locale is required!';
  }

  const target = `../src/translations/${locale}.json`;
  if (fs.existsSync(target)) {
    throw `Locale already exists. Remove ${target} for processing again.`;
  }

  TJO.init({
    googleApiKey: 'AIzaSyC28RQZZfce1pYlHdIc7TlUPfwCxKvZNbo'
  });

  TJO.translate(require('../src/translations/en.json'), locale)
    .then(function(data) {
      fs.writeFileSync(target, JSON.stringify(data), 'utf8');
      console.log(`Locale saved ${target}`);
    })
    .catch(function(err) {
      console.log('error ', err);
    });
}
