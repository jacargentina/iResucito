import { osLocale } from 'os-locale';
import I18n from '@iresucito/translations';
import { PdfStyles } from '@iresucito/core/common';
import { SongsParser } from '../SongsParser';
import { folderSongs } from '../webapp/utils.server';

var program = require('commander');

program
  .version('1.0')
  .description('Transport a given song')
  .option(
    '-l, --locale [locale]',
    'Locale to use. Defaults to current OS locale'
  )
  .option('-n, --note [note]', 'Transport note to use.')
  .option(
    '-k, --key [value]',
    'Song key. Defaults to generate all songs',
    parseInt
  );

if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
  const options = program.opts();
  var locale = options.locale;
  if (!locale) {
    locale = await osLocale();
    console.log('Locale: detected', locale);
  }
  I18n.locale = locale;
  console.log('Configured locale', I18n.locale);
  var key = options.key;
  if (locale !== '') {
    var parser = new SongsParser(PdfStyles);
    if (key) {
      var song = folderSongs.getSingleSongMeta(
        key,
        locale,
        undefined,
        undefined
      );
      const result = parser.getForRender(
        song.fullText,
        I18n.locale,
        options.note
      );
      console.log(result);
    }
  }
}
