// @flow
import fs from 'fs';
import osLocale from 'os-locale';
import I18n from '../translations';
import FolderSongs from '../FolderSongs';
import { SongsParser } from '../SongsParser';
import { PdfStyles } from '../common';

var program = require('commander');

program
  .version('1.0')
  .description('Remove extra spaces from song lyrics')
  .option(
    '-l, --locale [locale]',
    'Locale to use. Defaults to current OS locale'
  );
if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
  const options = program.opts();
  var locale = options.locale;
  if (!locale) {
    locale = osLocale.sync();
    console.log('Locale: detected', locale);
  }
  I18n.locale = locale;
  console.log('Configured locale', I18n.locale);
  if (locale !== '') {
    var parser = new SongsParser(PdfStyles);
    var songs = FolderSongs.getSongsMeta(locale);
    console.log(`Processing ${songs.length} songs`);
    FolderSongs.loadSongs(locale, songs).then(() => {
      songs.map((song) => {
        if (song.files[I18n.locale]) {
          var lines = parser.getSongLines(song.fullText, I18n.locale);
          var str = lines.map((x) => {
            if (x.type === 'canto') {
              return x.raw.trim();
            } else if (x.type === 'notas') {
              return x.raw.trimRight();
            }
            return x.raw;
          });
          fs.writeFileSync(song.path, str.join('\n'));
        }
      });
    });
  }
}
