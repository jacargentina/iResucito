export function esLineaDeNotas(text) {
  var linea = text
    .trim()
    .replace(/\[|\]|#|7|b7|9|-|\/|\u2013|aum/g, '')
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
  return soloNotas.length == linea.length;
}

export function getEsSalmo(listKey) {
  return (
    listKey == 'entrada' ||
    listKey == '1-salmo' ||
    listKey == '2-salmo' ||
    listKey == '3-salmo' ||
    listKey == 'paz' ||
    listKey == 'comunion' ||
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
    case 'comunion':
      text = 'Comunión';
      break;
    case 'salida':
      text = 'Canto de Salida';
      break;
    case '1-monicion':
      text = 'Monición 1er Palabra';
      break;
    case '1':
      text = '1er Palabra';
      break;
    case '1-salmo':
      text = 'Rta. 1er Palabra';
      break;
    case '2-monicion':
      text = 'Monición 2da Palabra';
      break;
    case '2':
      text = '2da Palabra';
      break;
    case '2-salmo':
      text = 'Rta. 2da Palabra';
      break;
    case '3-monicion':
      text = 'Monición 3ra Palabra';
      break;
    case '3':
      text = '3ra Palabra';
      break;
    case '3-salmo':
      text = 'Rta. 3ra Palabra';
      break;
    case 'evangelio-monicion':
      text = 'Monición Evangelio';
      break;
    case 'evangelio':
      text = 'Evangelio';
      break;
  }
  return text;
}
