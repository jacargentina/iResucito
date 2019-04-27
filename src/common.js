// @flow
// Utilerias comunes (no atadas a react-native ni a NodeJS)
import normalize from 'normalize-strings';

export const pdfValues = {
  fontName: 'Franklin Gothic Medium',
  titleFontSize: 19,
  titleSpacing: 11,
  fuenteFontSize: 10,
  fuenteSpacing: 20,
  cantoFontSize: 12,
  cantoSpacing: 11,
  indexSpacing: 12,
  indexExtraMarginLeftRight: 5,
  indicadorSpacing: 18,
  parrafoSpacing: 9,
  notesFontSize: 10,
  widthHeightPixels: 598, // 21,1 cm
  marginLeftRight: 25,
  marginTopBottom: 19
};

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

export const wayStages = [
  'precatechumenate',
  'liturgy',
  'catechumenate',
  'election'
];

export const getGroupedByStage = (songsToPdf: Array<SongToPdf>): any => {
  // Agrupados por stage
  return songsToPdf.reduce((groups, data) => {
    var groupKey = data.canto.stage;
    groups[groupKey] = groups[groupKey] || [];
    groups[groupKey].push(data.canto.titulo);
    return groups;
  }, {});
};

export const liturgicTimes = [
  'advent',
  'christmas',
  'lent',
  'easter',
  'pentecost'
];

export const getGroupedByLiturgicTime = (songsToPdf: Array<SongToPdf>): any => {
  // Agrupados por tiempo liturgico
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicTimes.filter(t => data.canto[t] === true);
    times.forEach(t => {
      groups[t] = groups[t] || [];
      groups[t].push(data.canto.titulo);
    });
    return groups;
  }, {});
};

export const liturgicOrder = [
  'signing to the virgin',
  /* eslint-disable quotes */
  "children's songs",
  /* eslint-enable quotes */
  'lutes and vespers',
  'entrance',
  'peace and offerings',
  'fraction of bread',
  'communion',
  'exit'
];

export const getGroupedByLiturgicOrder = (
  songsToPdf: Array<SongToPdf>
): any => {
  // Agrupados por tiempo liturgico
  return songsToPdf.reduce((groups, data) => {
    var times = liturgicOrder.filter(t => data.canto[t] === true);
    times.forEach(t => {
      groups[t] = groups[t] || [];
      groups[t].push(data.canto.titulo);
    });
    return groups;
  }, {});
};
