export const INITIALIZE_DONE = 'INITIALIZE_DONE';
export const SET_SALMOS_FILTER = 'SET_SALMOS_FILTER';
export const SET_SALMO_CONTENT = 'SET_SALMO_CONTENT';
export const SET_ABOUT_VISIBLE = 'SET_ABOUT_VISIBLE';
export const SET_SETTINGS_VALUE = 'SET_SETTINGS_VALUE';
export const SET_CHOOSER_TARGETLIST = 'SET_CHOOSER_TARGETLIST';
export const SET_LIST_CREATE_NEW = 'SET_LIST_CREATE_NEW';
export const SET_LIST_ADD_VISIBLE = 'SET_LIST_ADD_VISIBLE';
export const LIST_CREATE_NAME = 'LIST_CREATE_NAME';
export const LIST_CREATE = 'LIST_CREATE';
export const LIST_ADD_SALMO = 'LIST_ADD_SALMO';
export const LIST_REMOVE_SALMO = 'LIST_REMOVE_SALMO';
export const LIST_DELETE = 'LIST_DELETE';
export const LIST_SHARE = 'LIST_SHARE';

export const openSalmoChooserDialog = (listName, listKey) => {
  return {
    type: SET_CHOOSER_TARGETLIST,
    list: listName,
    key: listKey
  };
};

export const closeSalmoChooserDialog = () => {
  return {
    type: SET_CHOOSER_TARGETLIST,
    list: null,
    key: null
  };
};

export const addSalmoToList = (salmo, listName, listKey) => {
  return (dispatch, getState) => {
    // let state = getState();
    // var theList = state.ui.getIn(['lists', listName]);
    // if (theList.includes(salmo.nombre)) {
    //   return Promise.reject('El salmo ya estaba en la lista');
    // }
    dispatch({
      type: LIST_ADD_SALMO,
      list: listName,
      key: listKey,
      salmo: salmo
    });
    return Promise.resolve(
      `Agregaste "${salmo.titulo}" a la lista "${listName}"`
    );
  };
};

export const filterSalmoList = text => {
  return { type: SET_SALMOS_FILTER, filter: text };
};
