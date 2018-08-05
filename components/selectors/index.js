// @flow
import { createSelector } from 'reselect';
import {
  getEsSalmo,
  getFriendlyTextForListType,
  getDefaultLocale,
  preprocesarCanto,
  calcularTransporte
} from '../util';

const getLists = (state: any) => state.ui.get('lists');

const getLocale = (state: any) => state.ui.getIn(['settings', 'locale']);

export const getLocaleReal = createSelector(getLocale, locale => {
  if (locale === 'default') return getDefaultLocale();
  return locale;
});

export const getProcessedLists = createSelector(getLists, getLocale, lists => {
  var listNames = lists.keySeq().toArray();
  return listNames.map(name => {
    var listMap = lists.get(name);
    return {
      name: name,
      type: getFriendlyTextForListType(listMap.get('type'))
    };
  });
});

const getSongs = (state: any) => {
  return state.ui.get('songs');
};

export const getSearchItems = (state: any) => {
  return state.ui.get('search');
};

const getListFromNavigation = (state: any, props: any) => {
  return state.ui.getIn(['lists', props.navigation.state.params.list.name]);
};

export const getSongsFromList = createSelector(
  getSongs,
  getListFromNavigation,
  (songs, listMap) => {
    var result = listMap.map((valor, clave) => {
      // Si es de tipo 'libre', los salmos están dentro de 'items'
      if (clave === 'items') {
        valor = valor.map(nombre => {
          return songs.find(s => s.get('nombre') == nombre).toJS();
        });
      } else if (getEsSalmo(clave) && valor !== null) {
        return songs.find(s => s.get('nombre') == valor).toJS();
      }
      return valor;
    });
    return result;
  }
);

const getContactImportItems = (state: any) =>
  state.ui.get('contact_import_items');

const getContactImportSanitizedItems = createSelector(
  getContactImportItems,
  allContacts => {
    var grouped = allContacts.reduce(function(groups, item) {
      var fullname = `${item.givenName} ${item.familyName}`;
      groups[fullname] = groups[fullname] || [];
      groups[fullname].push(item);
      return groups;
    }, {});
    var unique = [];
    for (var fullname in grouped) {
      if (grouped[fullname].length > 1) {
        var conMiniatura = grouped[fullname].find(c => c.hasThumbnail === true);
        unique.push(conMiniatura || grouped[fullname][0]);
      } else {
        unique.push(grouped[fullname][0]);
      }
    }
    return unique;
  }
);

const getContacts = (state: any) => state.ui.get('contacts');

const ordenAlfabetico = (a, b) => {
  if (a.givenName < b.givenName) {
    return -1;
  }
  if (a.givenName > b.givenName) {
    return 1;
  }
  return 0;
};

const getCurrentRouteFilter = (state: any, props: any) => {
  if (props.navigation && props.navigation.state)
    return props.navigation.state.params
      ? props.navigation.state.params.filter
      : null;
  return null;
};

export const getCurrentRouteKey = (state: any, props: any) => {
  if (props.navigation && props.navigation.state)
    return props.navigation.state.key;
  return null;
};

export const getCurrentRouteContactsTextFilter = (state: any, props: any) => {
  return state.ui.getIn([
    'contacts_text_filter',
    getCurrentRouteKey(state, props)
  ]);
};

export const getProcessedContactsForImport = createSelector(
  getContactImportSanitizedItems,
  getContacts,
  (allContacts, importedContacts) => {
    var items = allContacts.map(c => {
      var found = importedContacts.find(x => x.get('recordID') === c.recordID);
      c.imported = found !== undefined;
      return c;
    });
    items.sort(ordenAlfabetico);
    return items;
  }
);

const contactFilterByText = (c, text: string) => {
  return (
    c.givenName.toLowerCase().includes(text.toLowerCase()) ||
    (c.familyName && c.familyName.toLowerCase().includes(text.toLowerCase()))
  );
};

export const getFilteredContactsForImport = createSelector(
  getProcessedContactsForImport,
  getCurrentRouteContactsTextFilter,
  (contacts, text_filter) => {
    if (text_filter) {
      return contacts.filter(c => contactFilterByText(c, text_filter));
    }
    return contacts;
  }
);

export const getProcessedContacts = createSelector(
  getContacts,
  getCurrentRouteContactsTextFilter,
  getLocale,
  (importedContacts, text_filter) => {
    var contactsArray = importedContacts.toJS();
    if (text_filter) {
      contactsArray = contactsArray.filter(c =>
        contactFilterByText(c, text_filter)
      );
    }
    contactsArray.sort(ordenAlfabetico);
    return contactsArray;
  }
);

export const getCurrentRouteSalmosTextFilter = (state: any, props: any) => {
  return state.ui.getIn([
    'salmos_text_filter',
    getCurrentRouteKey(state, props)
  ]);
};

export const getCurrentRouteSalmos = createSelector(
  getSongs,
  getCurrentRouteFilter,
  (songs, filter) => {
    var items = [];
    if (songs) {
      if (filter) {
        for (var name in filter) {
          items = songs.filter(s => s.get(name) == filter[name]);
        }
      } else {
        items = songs;
      }
    }
    return items;
  }
);

export const getFilterFromNavOrProps = (state: any, props: any) => {
  if (props.navigation) {
    var filterFromNav = props.navigation.getParam('filter', undefined);
    if (filterFromNav) {
      return filterFromNav;
    }
  }
  return props.filter;
};

export const getProcessedSalmos = createSelector(
  getCurrentRouteSalmos,
  getFilterFromNavOrProps,
  getCurrentRouteSalmosTextFilter,
  (songs, nav_filter, text_filter) => {
    if (nav_filter) {
      for (var name in nav_filter) {
        songs = songs.filter(s => s.get(name) == nav_filter[name]);
      }
    }
    if (text_filter) {
      songs = songs.filter(s => {
        return (
          s
            .get('nombre')
            .toLowerCase()
            .includes(text_filter.toLowerCase()) ||
          s
            .get('fullText', '')
            .toLowerCase()
            .includes(text_filter.toLowerCase())
        );
      });
    }
    return songs;
  }
);

export const getShowSalmosBadge = createSelector(
  getCurrentRouteFilter,
  filter => {
    return filter == null || !filter.hasOwnProperty('etapa');
  }
);

export const makeGetProcessedSalmos = () => {
  return createSelector(getProcessedSalmos, songs => songs);
};

export const getSalmoFromProps = (state: any, props: any) =>
  props.navigation.state.params.salmo;

export const getTransportToNote = (state: any) =>
  state.ui.get('salmos_transport_note');

export const getSalmoTransported = createSelector(
  getSalmoFromProps,
  getTransportToNote,
  (song, transportToNote) => {
    var lines = song.lines;
    var diferencia = 0;
    if (transportToNote) {
      diferencia = calcularTransporte(lines[0], transportToNote);
    }
    return preprocesarCanto(lines, diferencia);
  }
);

export const getLocaleSongs = (state: any) => state.ui.get('localeSongs');

export const getAvailableSongsForPatch = createSelector(
  getSongs,
  getLocaleSongs,
  getLocaleReal,
  (songs, localeSongs, locale) => {
    var res = localeSongs.filter(locSong => {
      var found = songs.find(
        s => s.getIn(['files', locale]) === locSong.nombre
      );
      return !found;
    });
    return res;
  }
);
