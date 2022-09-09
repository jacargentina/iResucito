// @flow
import osLocale from 'os-locale';
import I18n from '@iresucito/translations';
import moment from 'moment';

const path = require('path');
const inScripts = path.basename(process.cwd()) === path.basename(__dirname);
const songsDir = inScripts ? '../songs' : './songs';
const indexPath = path.resolve(songsDir, 'index.json');
const patchesPath = path.resolve(songsDir, 'patches.json');
//$FlowFixMe
var SongsIndex = require(indexPath);
//$FlowFixMe
var SongsPatches = require(patchesPath);

var program = require('commander');

program
  .version('1.0')
  .description('Generate last changes detail')
  .option(
    '-l, --locale [locale]',
    'Locale to use. Defaults to current OS locale'
  )
  .option('-D, --days [value]', 'List only from last specified days', parseInt);

program.parse(process.argv);
const options = program.opts();
var locale = options.locale;
var days = options.days;
if (!locale) {
  locale = osLocale.sync();
  console.log('Locale: detected', locale);
}
I18n.locale = locale;
console.log('Configured locale', I18n.locale);

var withTitleFlat = Object.keys(SongsPatches)
  .map((songKey) => {
    return SongsPatches[songKey].map((change) => {
      const { date, ...rest } = change;
      var title =
        SongsIndex[songKey].files[locale] || SongsIndex[songKey].files['es'];
      return { title, date: moment(date), ...rest };
    });
  })
  .flat();

withTitleFlat.sort((a, b) => a.date - b.date);

if (days !== 0) {
  console.log(`Filter last ${days} days`);
  var fromValue = moment().subtract(days, 'days');
  withTitleFlat = withTitleFlat.filter((i) => i.date >= fromValue);
}

console.log(withTitleFlat);
