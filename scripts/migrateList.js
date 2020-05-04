import FolderSongs from '../FolderSongs';
import { getEsSalmo } from '../common';

var songs = FolderSongs.getSongsMeta('es');

const migrateLists = (lists: any) => {
  // Verificar cada lista para migrar en caso
  // de ser necesario
  Object.keys(lists).forEach((name) => {
    var listMap = lists[name];
    // Listas sin número de versión
    // Los cantos se almacenaban con nombre
    // Y deben pasar a almacenarse las claves
    if (!listMap.version) {
      Object.entries(listMap).forEach(([clave, valor]) => {
        // Si es de tipo 'libre', los salmos están dentro de 'items'
        if (clave === 'items' && Array.isArray(valor)) {
          valor = valor.map((nombre) => {
            var theSong = songs.find((s) => s.nombre == nombre);
            if (theSong) {
              return theSong.key;
            }
            return null;
          });
        } else if (getEsSalmo(clave) && valor !== null) {
          var theSong = songs.find((s) => s.nombre == valor);
          if (theSong) {
            valor = theSong.key;
          } else {
            valor = null;
          }
        }
        // Guardar solo la clave del canto
        listMap[clave] = valor;
      });
      listMap.version = 1;
    }
  });
};

var lists = {
  Prueba: {
    '1': 'Is 2,3-5',
    '2': null,
    '3': null,
    type: 'palabra',
    ambiental: 'Javier',
    entrada: 'Abraham - Gn 18, 1-5',
    '1-monicion': 'Ines',
    '1-salmo': 'A shoot springs from the stock of Jesse - Is 11, 1-11',
    '2-monicion': null,
    '2-salmo': 'A la cena del cordero - Himno',
    '3-monicion': null,
    '3-salmo': null,
    'evangelio-monicion': null,
    evangelio: null,
    salida: null,
    nota: null,
  },
};

const getListForUI = (listName: any) => {
  var uiList = Object.assign({}, lists[listName]);
  Object.entries(uiList).forEach(([clave, valor]) => {
    // Si es de tipo 'libre', los salmos están dentro de 'items'
    if (clave === 'items' && Array.isArray(valor)) {
      valor = valor.map((key) => {
        return songs.find((s) => s.key == key);
      });
    } else if (getEsSalmo(clave) && valor !== null) {
      valor = songs.find((s) => s.key == valor);
    }
    uiList[clave] = valor;
  });
  return uiList;
};

console.log({ lists });

migrateLists(lists);

console.log({ lists });

var result = getListForUI('Prueba');

console.log({ result });
