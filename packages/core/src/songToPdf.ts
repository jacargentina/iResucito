import i18n from '@iresucito/translations';
import { loadAllLocales, SongsParser, SongsProcessor } from './';
import { generatePDF, PdfStyle, PdfStyles, SongToPdf } from './pdf';
import open from 'open';
import { osLocale } from 'os-locale';

const folderSongs = new SongsProcessor(loadAllLocales());

const main = async () => {
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
    const options = program.opts();
    var locale = options.locale;
    if (!locale) {
      locale = await osLocale();
      console.log('Locale: detected', locale);
    }
    i18n.locale = locale;
    console.log('Configured locale', i18n.locale);
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
        if (song.files[i18n.locale]) {
          try {
            await folderSongs.loadSingleSong(locale, song);
            console.log('Song: ', song.titulo);
            var render = parser.getForRender(song.fullText, i18n.locale);
            if (program.debug) {
              console.log(render);
            }
            const item: SongToPdf<PdfStyle> = {
              song,
              render,
            };
            const path = await generatePDF(
              [item],
              { ...PdfStyles, disablePageNumbers: true },
              item.song.titulo,
              false
            );
            if (path) {
              console.log(path);
              open(path);
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log('Song not found for given locale');
        }
      } else {
        var songs = folderSongs.getSongsMeta(locale, undefined, undefined);
        console.log(`No key Song. Generating ${songs.length} songs`);
        await folderSongs.loadSongs(locale, songs);
        var items: Array<SongToPdf<PdfStyle>> = [];
        songs.map((song) => {
          if (song.files[i18n.locale]) {
            var render = parser.getForRender(song.fullText, i18n.locale);
            if (program.debug) {
              console.log(render);
            }
            const item: SongToPdf<PdfStyle> = {
              song,
              render,
            };
            items.push(item);
          } else {
            console.log(
              `Song ${song.titulo} not found for given locale ${locale}`
            );
          }
        });
        const path = await generatePDF(
          items,
          PdfStyles,
          `iResucito-${locale}`,
          true
        );
        if (path) {
          console.log(path);
          open(path);
        }
      }
    }
  }
};

main();
