import { createSelector } from 'reselect';
import { getEsSalmo, getFriendlyTextForListType } from '../util';

const getLists = state => state.ui.get('lists');

export const getProcessedLists = createSelector(getLists, lists => {
  var listNames = lists.keySeq().toArray();
  return listNames.map(name => {
    var listMap = lists.get(name);
    return {
      name: name,
      type: getFriendlyTextForListType(listMap.get('type'))
    };
  });
});

const getSalmos = state => {
  return state.ui.get('salmos');
};

const getListFromNavigation = (state, props) => {
  return state.ui.getIn(['lists', props.navigation.state.params.list.name]);
};

export const getSalmosFromList = createSelector(
  getSalmos,
  getListFromNavigation,
  (salmos, listMap) => {
    var result = listMap.map((valor, clave) => {
      if (getEsSalmo(clave) && valor !== null) {
        return salmos.find(s => s.nombre == valor);
      }
      return valor;
    });
    return result;
  }
);

const getContactImportItems = state => state.ui.get('contact_import_items');
const getContactImportTextFilter = state =>
  state.ui.get('contact_import_text_filter');
const getContacts = state => state.ui.get('contacts');

const ordenAlfabetico = (a, b) => {
  if (a.givenName < b.givenName) {
    return -1;
  }
  if (a.givenName > b.givenName) {
    return 1;
  }
  return 0;
};

export const getProcessedContactsForImport = createSelector(
  getContactImportItems,
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

export const getFilteredContactsForImport = createSelector(
  getProcessedContactsForImport,
  getContactImportTextFilter,
  (contacts, text_filter) => {
    if (text_filter) {
      return contacts.filter(c => {
        return (
          c.givenName.toLowerCase().includes(text_filter.toLowerCase()) ||
          c.familyName.toLowerCase().includes(text_filter.toLowerCase())
        );
      });
    }
    return contacts;
  }
);

export const getProcessedContacts = createSelector(
  getContacts,
  importedContacts => {
    var contactsArray = importedContacts.toJS();
    contactsArray.sort(ordenAlfabetico);
    return contactsArray;
  }
);

const getCurrentRouteFilter = state => {
  const i = state.nav.index;
  const route = state.nav.routes[i];
  return route.params ? route.params.filter : null;
};

const getSalmosTextFilter = state => state.ui.get('salmos_text_filter');

export const getProcessedSalmos = createSelector(
  getSalmos,
  getCurrentRouteFilter,
  getSalmosTextFilter,
  (salmos, filter, text_filter) => {
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
    if (text_filter) {
      items = items.filter(s => {
        return s.nombre.toLowerCase().includes(text_filter.toLowerCase());
      });
    }
    return items;
  }
);

export const getShowSalmosBadge = createSelector(
  getCurrentRouteFilter,
  filter => {
    return filter == null || !filter.hasOwnProperty('etapa');
  }
);
