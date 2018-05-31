// @flow
import { createSelector } from 'reselect';
import {
  getEsSalmo,
  getFriendlyTextForListType,
  preprocesarCanto,
  calcularTransporte
} from '../util';

const getLists = (state: any) => state.ui.get('lists');

const getLocale = (state: any) => state.ui.getIn(['settings', 'locale']);

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

const getSalmos = (state: any) => {
  return state.ui.get('salmos');
};

export const getSearchItems = (state: any) => {
  return state.ui.get('search');
};

const getListFromNavigation = (state: any, props: any) => {
  return state.ui.getIn(['lists', props.navigation.state.params.list.name]);
};

export const getSalmosFromList = createSelector(
  getSalmos,
  getListFromNavigation,
  (salmos, listMap) => {
    var result = listMap.map((valor, clave) => {
      // Si es de tipo 'libre', los salmos están dentro de 'items'
      if (clave === 'items') {
        valor = valor.map(nombre => {
          return salmos.find(s => s.nombre == nombre);
        });
      } else if (getEsSalmo(clave) && valor !== null) {
        return salmos.find(s => s.nombre == valor);
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

const getCurrentRouteFilter = (state: any) => {
  const i = state.nav.index;
  const route = state.nav.routes[i];
  return route.params ? route.params.filter : null;
};

export const getCurrentRouteKey = (state: any) => {
  return state.nav.routes[state.nav.index].key;
};

export const getCurrentRouteContactsTextFilter = (state: any) => {
  return state.ui.getIn(['contacts_text_filter', getCurrentRouteKey(state)]);
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

export const getCurrentRouteSalmosTextFilter = (state: any) => {
  return state.ui.getIn(['salmos_text_filter', getCurrentRouteKey(state)]);
};

export const getCurrentRouteSalmos = createSelector(
  getSalmos,
  getCurrentRouteFilter,
  (salmos, filter) => {
    var items = [];
    if (salmos) {
      if (filter) {
        for (var name in filter) {
          items = salmos.filter(s => s[name] == filter[name]);
        }
      } else {
        items = salmos;
      }
    }
    return items;
  }
);

export const getFilterFromProps = (state: any, props: any) => {
  if (props.navigation) {
    return props.navigation.getParam('filter', undefined);
  }
  return props.filter;
};

export const getProcessedSalmos = createSelector(
  getCurrentRouteSalmos,
  getFilterFromProps,
  getCurrentRouteSalmosTextFilter,
  (salmos, nav_filter, text_filter) => {
    if (nav_filter) {
      for (var name in nav_filter) {
        salmos = salmos.filter(s => s[name] == nav_filter[name]);
      }
    }
    if (text_filter) {
      salmos = salmos.filter(s => {
        return (
          s.nombre.toLowerCase().includes(text_filter.toLowerCase()) ||
          s.fullText.toLowerCase().includes(text_filter.toLowerCase())
        );
      });
    }
    return salmos;
  }
);

export const getShowSalmosBadge = createSelector(
  getCurrentRouteFilter,
  filter => {
    return filter == null || !filter.hasOwnProperty('etapa');
  }
);

export const makeGetProcessedSalmos = () => {
  return createSelector(getProcessedSalmos, salmos => salmos);
};

export const getSalmoFromProps = (state: any, props: any) =>
  props.navigation.state.params.salmo;

export const getTransportToNote = (state: any) =>
  state.ui.get('salmos_transport_note');

export const getSalmoTransported = createSelector(
  getSalmoFromProps,
  getTransportToNote,
  (salmo, transportToNote) => {
    var lines = salmo.lines;
    var diferencia = 0;
    if (transportToNote) {
      diferencia = calcularTransporte(lines[0], transportToNote);
    }
    return preprocesarCanto(lines, diferencia);
  }
);
