// @flow
import osLocale from 'os-locale';
import I18n from '../translations';
import FolderSongs from '../FolderSongs';
import { SongsParser } from '../SongsParser';
import { generatePDF } from './pdf';
import { defaultExportToPdfOptions, PdfStyles } from '../common';

var program = require('commander');

program
  .version('1.0')
  .description('Generate PDF for a given song')
  .option(
    '-l, --locale [locale]',
    'Locale to use. Defaults to current OS locale'
  )
  .option(
    '-k, --key [value]',
    'Song key. Defaults to generate all songs',
    parseInt
  )
  .option('-D, --debug', 'Show debugging data (only development)');

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
  var key = program.key;
  if (locale !== '') {
    var parser = new SongsParser(PdfStyles);
    if (key) {
      var song = FolderSongs.getSingleSongMeta(key, locale);
      if (song.files[I18n.locale]) {
        FolderSongs.loadSingleSong(locale, song)
          .then(() => {
            console.log('Song: ', song.titulo);
            var render = parser.getForRender(song.fullText, I18n.locale);
            if (program.debug) {
              console.log(render);
            }
            const item: SongToPdf = {
              song,
              render
            };
            generatePDF([item], defaultExportToPdfOptions, '').then(p => {
              console.log(p);
            });
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        console.log('Song not found for given locale');
      }
    } else {
      var songs = FolderSongs.getSongsMeta(locale);
      console.log(`No key Song. Generating ${songs.length} songs`);
      Promise.all(FolderSongs.loadSongs(locale, songs)).then(() => {
        var items = [];
        songs.map(song => {
          if (song.files[I18n.locale]) {
            var render = parser.getForRender(song.fullText, I18n.locale);
            if (program.debug) {
              console.log(render);
            }
            const item: SongToPdf = {
              song,
              render
            };
            items.push(item);
          } else {
            console.log(
              `Song ${song.titulo} not found for given locale ${locale}`
            );
          }
        });
        generatePDF(items, defaultExportToPdfOptions, `-${locale}`).then(p => {
          console.log(p);
        });
      });
    }
  }
}
