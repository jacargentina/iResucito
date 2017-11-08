const limpiarNotasRegex = /\[|\]|#|\*|5|6|7|9|b|-|\/|\u2013|\u2217|aum/g;

export function esLineaDeNotas(text) {
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
  var text = '';
  switch (listKey) {
    case 'ambiental':
      text = 'Monición Ambiental';
      break;
    case 'entrada':
      text = 'Canto de Entrada';
      break;
    case 'paz':
      text = 'Paz y Ofrendas';
      break;
    case 'comunion-pan':
      text = 'Pan';
      break;
    case 'comunion-caliz':
      text = 'Cáliz';
      break;
    case 'salida':
      text = 'Canto de Salida';
      break;
    case '1-monicion':
      text = 'Monición 1a Lectura';
      break;
    case '1':
      text = '1a Lectura';
      break;
    case '1-salmo':
      text = 'Canto 1a Lectura';
      break;
    case '2-monicion':
      text = 'Monición 2a Lectura';
      break;
    case '2':
      text = '2a Lectura';
      break;
    case '2-salmo':
      text = 'Canto 2a Lectura';
      break;
    case '3-monicion':
      text = 'Monición 3a Lectura';
      break;
    case '3':
      text = '3a Lectura';
      break;
    case '3-salmo':
      text = 'Canto 3a Lectura';
      break;
    case 'evangelio-monicion':
      text = 'Monición Evangelio';
      break;
    case 'evangelio':
      text = 'Evangelio';
      break;
    case 'nota':
      text = 'Nota';
      break;
  }
  return text;
}

export function getFriendlyTextForListType(listType) {
  switch (listType) {
    case 'eucaristia':
      return 'Eucaristía';
    case 'palabra':
      return 'Palabra';
    case 'libre':
      return 'Otras';
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

// var linea = 'Re-   Re7    Sol- Sib7     La';
// var diferencia = calcularTransporte(linea, 'Do');
//  eslint-disable no-console
// console.log('linea', linea);
// console.log('resultado', transportarNotas(linea, diferencia));
