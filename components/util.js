import I18n from '../i18n';
import langs from 'langs';
import { NativeModules } from 'react-native';

export const defaultLocale = NativeModules.RNI18n.languages[0];

const limpiarNotasRegex = /\[|\]|#|\*|5|6|7|9|b|-|\+|\/|\u2013|\u2217|aum|dim/g;

export function esLineaDeNotas(text) {
  if (text === undefined) {
    throw 'esLineaDeNotas: no se puede procesar "undefined"';
  }
  var linea = text
    .trim()
    .replace(limpiarNotasRegex, '')
    .split(' ')
    .filter(i => i.length > 0);
  var soloNotas = linea.filter(palabra => {
    return (
      palabra == 'Do' ||
      palabra == 'Re' ||
      palabra == 'Mi' ||
      palabra == 'Fa' ||
      palabra == 'Sol' ||
      palabra == 'La' ||
      palabra == 'Si'
    );
  });
  return soloNotas.length > 0 && soloNotas.length == linea.length;
}

export function getEsSalmo(listKey) {
  return (
    listKey == 'entrada' ||
    listKey == '1-salmo' ||
    listKey == '2-salmo' ||
    listKey == '3-salmo' ||
    listKey == 'paz' ||
    listKey == 'comunion-pan' ||
    listKey == 'comunion-caliz' ||
    listKey == 'salida'
  );
}

export function getFriendlyText(listKey) {
  return I18n.t(`list_item.${listKey}`);
}

export function getFriendlyTextForListType(listType) {
  switch (listType) {
    case 'eucaristia':
      return I18n.t('list_type.eucharist');
    case 'palabra':
      return I18n.t('list_type.word');
    case 'libre':
      return I18n.t('list_type.other');
  }
}

export const notas = [
  'Do',
  'Do#',
  'Re',
  'Mib',
  'Mi',
  'Fa',
  'Fa#',
  'Sol',
  'Sol#',
  'La',
  'Sib',
  'Si'
];

export const notasInverted = notas.slice().reverse();

export const notaInicial = linea => {
  var pedazos = linea.split(' ');
  var primero = pedazos[0];
  return primero.replace(limpiarNotasRegex, '');
};

export const transportarNotas = (lineaNotas, diferencia) => {
  var pedazos = lineaNotas.split(' ');
  var result = pedazos.map(item => {
    var notaLimpia = item.replace(limpiarNotasRegex, '');
    var notaIndex = notas.indexOf(notaLimpia);
    if (notaIndex !== -1) {
      var notaNuevoIndex = (notaIndex + diferencia) % 12;
      var transporte =
        notaNuevoIndex < 0
          ? notasInverted[notaNuevoIndex * -1]
          : notas[notaNuevoIndex];
      if (notaLimpia.length !== item.length)
        transporte += item.substring(notaLimpia.length);
      return transporte;
    }
    return item;
  });
  return result.join(' ');
};

export const calcularTransporte = (primerLineaNotas, notaDestino) => {
  var notaOrigen = notaInicial(primerLineaNotas);
  var inicio = notas.indexOf(notaOrigen);
  var destino = notas.indexOf(notaDestino);
  return destino - inicio;
};

export const getLocalesForPicker = () => {
  var locales = [
    { label: `${I18n.t('ui.default')} (${defaultLocale})`, value: 'default' }
  ];
  for (var code in I18n.translations) {
    var l = langs.where('1', code);
    locales.push({ label: `${l.local} (${code})`, value: code });
  }
  return locales;
};
