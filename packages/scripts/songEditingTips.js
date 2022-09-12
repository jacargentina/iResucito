// @flow
import I18n from '@iresucito/translations';
import FolderSongs from '../FolderSongs';
import { SongsParser } from '../SongsParser';
import { PdfStyles } from '@iresucito/core/common';

import('os-locale').then((oslocale) => {
  var program = require('commander');

  program
    .version('1.0')
    .description('Get editing tips for songs')
    .option(
      '-l, --locale <locale>',
      'Locale to use. Defaults to current OS locale'
    );
  program.parse(process.argv);
  const options = program.opts();
  var locale = options.locale;
  if (!locale) {
    locale = oslocale.osLocaleSync();
    console.log('Locale: detected', locale);
  }
  I18n.locale = locale;
  console.log('Configured locale', I18n.locale);
  if (locale !== '') {
    var parser = new SongsParser(PdfStyles);
    var songs = FolderSongs.getSongsMeta(locale);
    console.log(`Processing ${songs.length} songs`);
    console.log('--------------------------------');
    FolderSongs.loadSongs(locale, songs).then(() => {
      songs.map((song) => {
        if (song.files[I18n.locale]) {
          var songSuggestions = [];
          var render = parser.getForRender(song.fullText, I18n.locale);
          const firstNotes = render.items.find((it) =>
            parser.isChordsLine(it.texto, locale)
          );
          if (firstNotes) {
            var fn = render.items.indexOf(firstNotes);
            if (fn !== -1 && fn > 0) {
              if (
                render.items.find((x, idx) => {
                  return (
                    idx < fn &&
                    x.type !== 'posicionAbrazadera' &&
                    x.type !== 'notaEspecial' &&
                    x.type !== 'tituloEspecial' &&
                    x.type !== 'textoEspecial' &&
                    x.type !== 'inicioParrafo'
                  );
                })
              ) {
                songSuggestions.push(`- notes on line ${fn} ?`);
              }
            }
          }
          const possibleBis = render.items.filter(
            (i) => i.texto.includes('BIS') || i.texto.includes('2x')
          );
          if (possibleBis.length > 0) {
            songSuggestions.push(
              `- possible repeat's missing (${possibleBis.length} times)`
            );
          }
          render.items.forEach((x, idx) => {
            if (
              (x.type === 'canto' || x.type === 'cantoConIndicador') &&
              idx + 1 < render.items.length
            ) {
              const y = render.items[idx + 1];
              if (y.type === 'notas' && idx + 2 < render.items.length) {
                const z = render.items[idx + 2];
                if (z.type === 'cantoConIndicador') {
                  songSuggestions.push(
                    `- possible missing NEWLINE between paragraphs? Between ${
                      x.texto
                    } (line ${idx}) and ${z.texto} (line ${idx + 2})`
                  );
                }
              }
            }
          });
          if (songSuggestions.length > 0) {
            console.log(song.nombre);
            console.log(songSuggestions.join('\n'));
          }
        }
      });
    });
  }
});
