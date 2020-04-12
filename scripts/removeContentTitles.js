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
  .description('Remove titles from song content')
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
  if (locale !== '') {
    var parser = new SongsParser(PdfStyles);
    var songs = FolderSongs.getSongsMeta(locale);
    console.log(`Processing ${songs.length} songs`);
    FolderSongs.loadSongs(locale, songs).then(() => {
      songs.map((song) => {
        if (song.files[I18n.locale]) {
          var render = parser.getForRender(song.fullText, I18n.locale);
          const firstNotes = render.items.find((it) =>
            parser.isChordsLine(it.texto, locale)
          );
          if (firstNotes) {
            var fn = render.items.indexOf(firstNotes);
            if (fn !== -1 && fn > 0) {
              var firstCanto = render.items.find((x, idx) => {
                return idx < fn && x.type === 'canto';
              });
              if (firstCanto) {
                var arr = song.fullText.replace('\r\n', '\n').split('\n');
                var res = arr.slice(fn);
                var ft = res.join('\n');
                fs.writeFileSync(song.path, ft);
              }
            }
          }
        }
      });
    });
  }
}
