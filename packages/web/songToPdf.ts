import I18n from '@iresucito/translations';
import {
  defaultExportToPdfOptions,
  PdfStyles,
  SongsParser,
  SongToPdf,
} from '@iresucito/core';
import { folderSongs } from './utils.server';
import { generatePDF } from './pdf';
import open from 'open';

var program = require('commander');

import('os-locale').then((oslocale) => {
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
      locale = oslocale.osLocaleSync();
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
        if (song.files[I18n.locale]) {
          folderSongs
            .loadSingleSong(locale, song)
            .then(() => {
              console.log('Song: ', song.titulo);
              var render = parser.getForRender(song.fullText, I18n.locale);
              if (program.debug) {
                console.log(render);
              }
              const item: SongToPdf = {
                song,
                render,
              };
              generatePDF([item], defaultExportToPdfOptions, '').then(
                (path) => {
                  if (path) {
                    console.log(path);
                    open(path);
                  }
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log('Song not found for given locale');
        }
      } else {
        var songs = folderSongs.getSongsMeta(locale, undefined, undefined);
        console.log(`No key Song. Generating ${songs.length} songs`);
        folderSongs.loadSongs(locale, songs).then(() => {
          var items: Array<SongToPdf> = [];
          songs.map((song) => {
            if (song.files[I18n.locale]) {
              var render = parser.getForRender(song.fullText, I18n.locale);
              if (program.debug) {
                console.log(render);
              }
              const item: SongToPdf = {
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
          generatePDF(items, defaultExportToPdfOptions, `-${locale}`).then(
            (path) => {
              if (path) {
                console.log(path);
                open(path);
              }
            }
          );
        });
      }
    }
  }
});
