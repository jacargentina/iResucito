// @flow
// Utilerias comunes (no atadas a react-native ni a NodeJS)
import normalize from 'normalize-strings';

export const asyncForEach = async (array: Array<any>, callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const getAlphaWithSeparators = (
  songsToPdf: Array<SongToPdf>
): Array<string> => {
  // Alfabetico
  var items = songsToPdf.map(data => {
    return data.canto.titulo;
  });
  var i = 0;
  var letter = normalize(items[i][0]);
  while (i < items.length) {
    const curLetter = normalize(items[i][0]);
    if (curLetter !== letter) {
      letter = curLetter;
      items.splice(i, 0, '');
    }
    i++;
  }
  return items;
};

export const getGroupedByEtapa = (songsToPdf: Array<SongToPdf>): any => {
  // Agrupados por etapa
  return songsToPdf.reduce((groups, data) => {
    var fullname = data.canto.etapa;
    groups[fullname] = groups[fullname] || [];
    groups[fullname].push(data.canto.titulo);
    return groups;
  }, {});
};
