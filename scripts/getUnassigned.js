// @flow
import osLocale from 'os-locale';
import I18n from '../src/translations';
import { FolderSongs } from './FolderSongs';

var program = require('commander');

program
  .version('1.0')
  .description('List unassigned songs')
  .option(
    '-l, --locale [locale]',
    'Locale to use. Defaults to current OS locale'
  );

if (!process.argv.slice(2).length) {
  program.help();
} else {
  program.parse(process.argv);
  var locale = program.locale;
  if (!locale) {
    locale = osLocale.sync();
    console.log('Locale: detected', locale);
  }
  I18n.locale = locale;
  console.log('Configured locale', I18n.locale);

  var songs = FolderSongs.getSongsMeta(I18n.locale);
  FolderSongs.readLocaleSongs(locale).then(localeSongs => {
    console.log();
    var result = localeSongs.filter(locSong => {
      const rawLoc = I18n.locale;
      if (!songs.find(s => s.files[rawLoc] === locSong.nombre)) {
        const locale = rawLoc.split('-')[0];
        return !songs.find(s => s.files[locale] === locSong.nombre);
      }
      return false;
    });
    console.log(
      `Total Index: ${songs.length}, Total Locale Songs: ${
        localeSongs.length
      }, unassigned: ${result.length}`
    );
    console.log(result.map(r => r.nombre));
  });
}
