// @flow
// Utilerias comunes (no atadas a react-native ni a NodeJS)
import normalize from 'normalize-strings';

var pdfVars = {
  fontName: 'Franklin Gothic Medium',
  marginLeft: 25,
  marginTop: 19,
  widthHeightPixels: 598, // 21,1 cm
  songTitle: { FontSize: 19, Spacing: 11 },
  songSource: { FontSize: 10, Spacing: 20 },
  songText: { FontSize: 12, Spacing: 11 },
  songNote: { FontSize: 10 },
  songIndicatorSpacing: 18,
  songParagraphSpacing: 9,
  indexTitle: { FontSize: 16, Spacing: 14 },
  indexSubtitle: { FontSize: 12, Spacing: 4 },
  indexText: { FontSize: 11, Spacing: 3 },
  indexExtraMarginLeft: 25,
  primerColumnaX: 0,
  segundaColumnaX: 0,
  primerColumnaIndexX: 0,
  segundaColumnaIndexX: 0
};

pdfVars.primerColumnaX = pdfVars.marginLeft;
pdfVars.segundaColumnaX =
  pdfVars.widthHeightPixels / 2 + pdfVars.primerColumnaX;
pdfVars.primerColumnaIndexX = pdfVars.marginLeft + pdfVars.indexExtraMarginLeft;
pdfVars.segundaColumnaIndexX =
  pdfVars.widthHeightPixels / 2 + pdfVars.indexExtraMarginLeft;

export const pdfValues = pdfVars;

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
    const sameName = songsToPdf.filter(
      d => d.canto.titulo === data.canto.titulo
    );
    return sameName.length > 1 ? data.canto.nombre : data.canto.titulo;
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
    const groupKey = data.canto.stage;
    groups[groupKey] = groups[groupKey] || [];
    const sameName = songsToPdf.filter(
      d => d.canto.titulo === data.canto.titulo
    );
    const title = sameName.length > 1 ? data.canto.nombre : data.canto.titulo;
    groups[groupKey].push(title);
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
      const sameName = songsToPdf.filter(
        d => d.canto.titulo === data.canto.titulo
      );
      const title = sameName.length > 1 ? data.canto.nombre : data.canto.titulo;
      groups[t].push(title);
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
      const sameName = songsToPdf.filter(
        d => d.canto.titulo === data.canto.titulo
      );
      const title = sameName.length > 1 ? data.canto.nombre : data.canto.titulo;
      groups[t].push(title);
    });
    return groups;
  }, {});
};
