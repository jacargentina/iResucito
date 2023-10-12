// Transformar la estructura de songs.json
// para referenciar el index especifico
// de cada locale en cada canto
import * as fs from 'fs';
import SongsIndexRaw from '../assets/songs.json';
import { SongsData, SongsSourceData } from './common';

export const SongsIndex: SongsData = SongsIndexRaw;

var allLocales: SongsSourceData = {};

var langs = './assets/songs';
var items = fs.readdirSync(langs, { withFileTypes: true });
items.forEach((locale) => {
  if (locale.isFile() && locale.name.endsWith('.json')) {
    var text = fs.readFileSync(`./assets/songs/${locale.name}`, {
      encoding: 'utf8',
    });
    allLocales[locale.name.replace('.json', '')] = JSON.parse(text);
  }
});

var newIndex: SongsData = {};
Object.keys(SongsIndex).forEach((key) => {
  newIndex[key] = SongsIndex[key];
  Object.keys(newIndex[key].files).forEach((lang) => {
    var nameToSearch = newIndex[key].files[lang];
    var foundIndex: string = '';
    for (var index of Object.keys(allLocales[lang])) {
      if (allLocales[lang][index].name == nameToSearch) {
        foundIndex = index;
        break;
      }
    }
    newIndex[key].files[lang] = foundIndex;
  });
});

var targetPath = './assets/songsv2.json';
fs.writeFileSync(targetPath, JSON.stringify(newIndex, null, 2));
console.log(targetPath);
