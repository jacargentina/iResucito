const fs = require('fs');
const path = require('path');
const program = require('commander');

program
  .version('1.0')
  .description('Ensure translation key is present on all languages')
  .option(
    '-k, --key [key path]',
    'Locale key path (ex. alert_title.my_sub_key)'
  );

if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
  const options = program.opts();
  var key = options.key;
  if (!key) {
    throw 'Locale key path is required!';
  }
  const dir = path.resolve('./translations');
  const langs = fs.readdirSync(dir);
  langs.forEach((locale) => {
    const target = `./translations/${locale}`;
    if (target.endsWith('.json')) {
      const str = fs.readFileSync(target, 'utf8');
      var object = JSON.parse(str);
      var pointer = object;
      const parts = key.split('.');
      parts.forEach((p, i) => {
        if (!pointer.hasOwnProperty(p)) {
          var newKeyObj = i === parts.length - 1 ? '' : {};
          pointer[p] = newKeyObj;
          pointer = newKeyObj;
        } else {
          pointer = object[p];
        }
      });
      var newStr = JSON.stringify(object, null, '  ');
      fs.writeFileSync(target, newStr);
    }
  });
}
