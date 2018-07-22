// @flow
import langs from 'langs';
import { NativeModules, StyleSheet, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import I18n from './translations';

const limpiarNotasRegex = /\[|\]|#|\*|5|6|7|9|b|-|\+|\/|\u2013|\u2217|aum|dim/g;

export function esLineaDeNotas(text: string): boolean {
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

export function getEsSalmo(listKey: string): boolean {
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

export function getFriendlyText(listKey: string): string {
  return I18n.t(`list_item.${listKey}`);
}

export function getFriendlyTextForListType(listType: string): string {
  switch (listType) {
    case 'eucaristia':
      return I18n.t('list_type.eucharist');
    case 'palabra':
      return I18n.t('list_type.word');
    case 'libre':
      return I18n.t('list_type.other');
    default:
      return '';
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

export const notaInicial = (linea: string): string => {
  var pedazos = linea.split(' ');
  var primero = pedazos[0];
  return primero.replace(limpiarNotasRegex, '');
};

export const transportarNotas = (
  lineaNotas: string,
  diferencia: number
): string => {
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

export const calcularTransporte = (
  primerLineaNotas: string,
  notaDestino: string
): number => {
  var notaOrigen = notaInicial(primerLineaNotas);
  var inicio = notas.indexOf(notaOrigen);
  var destino = notas.indexOf(notaDestino);
  return destino - inicio;
};

export const getDefaultLocale = () => {
  return NativeModules.RNI18n.languages[0];
};

export const getLocalesForPicker = () => {
  var locales = [
    {
      label: `${I18n.t('ui.default')} (${getDefaultLocale()})`,
      value: 'default'
    }
  ];
  for (var code in I18n.translations) {
    var l = langs.where('1', code);
    locales.push({ label: `${l.local} (${code})`, value: code });
  }
  return locales;
};

var mono = Platform.OS == 'ios' ? 'Menlo-Bold' : 'monospace';
var isTablet = DeviceInfo.isTablet();
var fontSizeTitulo = isTablet ? 25 : 20;
var fontSizeTexto = isTablet ? 17 : 14;
var fontSizeNotas = isTablet ? 15.2 : 12.2;

export const stylesObj = {
  titulo: {
    fontFamily: mono,
    color: '#ff0000',
    fontSize: fontSizeTitulo,
    marginTop: 8,
    marginBottom: 4
  },
  fuente: {
    fontFamily: mono,
    color: '#777777',
    fontSize: fontSizeTexto - 1,
    marginBottom: 8
  },
  lineaNotas: {
    fontFamily: mono,
    color: '#ff0000',
    fontSize: fontSizeNotas,
    marginLeft: 4
  },
  lineaTituloNotaEspecial: {
    fontFamily: mono,
    color: '#ff0000'
  },
  lineaNotaEspecial: {
    fontFamily: mono,
    fontSize: fontSizeNotas,
    color: '#444444'
  },
  lineaNotasConMargen: {
    fontFamily: mono,
    color: '#ff0000',
    fontSize: fontSizeNotas,
    marginTop: 15,
    marginLeft: 4
  },
  lineaNormal: {
    fontFamily: mono,
    color: '#000000',
    fontSize: fontSizeTexto,
    marginBottom: 8
  },
  prefijo: {
    fontFamily: mono,
    color: '#777777',
    fontSize: fontSizeTexto
  }
};

export const styles = StyleSheet.create(stylesObj);

/* eslint-disable no-unused-vars */
export const preprocesarLinea = (text: string): SongLine => {
  if (text.startsWith('S. A.')) {
    // Indicador de Salmista Y Asamblea
    var secondPoint = 4;
    var it: SongLine = {
      texto: text.substring(secondPoint + 1).trim(),
      style: styles.lineaNormal,
      prefijo: text.substring(0, secondPoint + 1) + ' ',
      prefijoStyle: styles.prefijo,
      sufijo: '',
      sufijoStyle: null,
      canto: false,
      cantoConIndicador: true,
      notas: false,
      inicioParrafo: false,
      notaEspecial: false,
      tituloEspecial: false,
      textoEspecial: false
    };
    return it;
  } else if (
    text.startsWith('S.') ||
    text.startsWith('C.') ||
    text.startsWith('D.') ||
    text.startsWith('U.') ||
    text.startsWith('H.') ||
    text.startsWith('M.') ||
    text.startsWith('A.') ||
    text.startsWith('P.') ||
    text.startsWith('Niños.') ||
    text.startsWith('N.')
  ) {
    // Indicador de Salmista, Asamblea, Presbitero, Hombres, Mujeres, etc
    var pointIndex = text.indexOf('.');
    var it: SongLine = {
      texto: text.substring(pointIndex + 1).trim(),
      style: styles.lineaNormal,
      prefijo: text.substring(0, pointIndex + 1) + ' ',
      prefijoStyle: styles.prefijo,
      sufijo: '',
      sufijoStyle: null,
      canto: false,
      cantoConIndicador: true,
      notas: false,
      inicioParrafo: false,
      notaEspecial: false,
      tituloEspecial: false,
      textoEspecial: false
    };
    // Si tiene indicador de Nota?
    if (it.texto.endsWith('\u2217')) {
      it.texto = it.texto.replace('\u2217', '');
      it.sufijo = '\u2217';
      it.sufijoStyle = styles.lineaNotas;
    }
    return it;
  } else if (esLineaDeNotas(text)) {
    var it: SongLine = {
      texto: text.trimRight(),
      style: styles.lineaNotas,
      prefijo: '',
      prefijoStyle: null,
      sufijo: '',
      sufijoStyle: null,
      canto: false,
      cantoConIndicador: true,
      notas: true,
      inicioParrafo: false,
      notaEspecial: false,
      tituloEspecial: false,
      textoEspecial: false
    };
    return it;
  } else if (text.startsWith('\u2217')) {
    // Nota especial
    var it: SongLine = {
      texto: text.substring(1).trim(),
      style: styles.lineaNotaEspecial,
      prefijo: '\u2217  ',
      prefijoStyle: styles.lineaNotas,
      sufijo: '',
      sufijoStyle: null,
      canto: false,
      cantoConIndicador: true,
      notas: false,
      inicioParrafo: false,
      notaEspecial: true,
      tituloEspecial: false,
      textoEspecial: false
    };
    return it;
  } else if (text.trim().startsWith('**') && text.trim().endsWith('**')) {
    // Titulo especial
    var it: SongLine = {
      canto: false,
      texto: text.replace(/\*/g, '').trim(),
      style: styles.lineaTituloNotaEspecial,
      prefijo: '',
      prefijoStyle: null,
      sufijo: '',
      sufijoStyle: null,
      canto: false,
      cantoConIndicador: true,
      notas: false,
      inicioParrafo: true,
      notaEspecial: false,
      tituloEspecial: true,
      textoEspecial: false
    };
    return it;
  } else if (text.startsWith('-')) {
    // Texto especial
    var it: SongLine = {
      canto: false,
      texto: text.replace('-', '').trim(),
      style: styles.lineaNotaEspecial,
      prefijo: '',
      prefijoStyle: null,
      sufijo: '',
      sufijoStyle: null,
      canto: false,
      cantoConIndicador: true,
      notas: false,
      inicioParrafo: false,
      notaEspecial: false,
      tituloEspecial: false,
      textoEspecial: true
    };
    return it;
  } else {
    var texto = text.trimRight();
    var it: SongLine = {
      texto: texto,
      style: styles.lineaNormal,
      prefijo: '',
      prefijoStyle: null,
      sufijo: '',
      sufijoStyle: null,
      canto: texto !== '',
      cantoConIndicador: texto !== '',
      notas: false,
      inicioParrafo: false,
      notaEspecial: false,
      tituloEspecial: false,
      textoEspecial: false
    };
    return it;
  }
};

export const preprocesarCanto = (
  lines: Array<string>,
  diferenciaTransporte: number
): Array<SongLine> => {
  var firstPass = lines.map(l => {
    var it = preprocesarLinea(l);
    if (it.notas && diferenciaTransporte !== 0) {
      it.texto = transportarNotas(it.texto, diferenciaTransporte);
    }
    return it;
  });
  return firstPass.map((it, i) => {
    // Ajustar margen izquierdo por prefijos
    if (it.prefijo == '' && i > 0) {
      var prevIt = firstPass[i - 1];
      if (prevIt.prefijo !== '') {
        it.prefijo = ' '.repeat(prevIt.prefijo.length);
      }
    } else if (it.prefijo == '' && i < firstPass.length - 1) {
      var nextIt = firstPass[i + 1];
      if (nextIt.prefijo !== '') {
        it.prefijo = ' '.repeat(nextIt.prefijo.length);
      }
    }
    // Ajustar estilo para las notas
    if (it.texto.trim() == '' && i < firstPass.length - 1) {
      var nextItm = firstPass[i + 1];
      if (nextItm.canto) {
        it.style = styles.lineaNotas;
        it.notas = true;
      }
    }
    // Ajustar estilo para las notas si es la primer linea
    if (it.notas && i < firstPass.length - 1) {
      var nextItmn = firstPass[i + 1];
      if (nextItmn.prefijo !== '') {
        it.style = styles.lineaNotasConMargen;
        it.inicioParrafo = true;
      }
    }
    // Ajustar inicios de parrafo (lineas vacias)
    if (it.texto === '' && i < firstPass.length - 1) {
      var nextItmnn = firstPass[i + 1];
      if (
        nextItmnn.notas ||
        nextItmnn.texto === '' ||
        nextItmnn.cantoConIndicador
      ) {
        it.inicioParrafo = true;
      }
    }
    return it;
  });
};
