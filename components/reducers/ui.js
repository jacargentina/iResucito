import { INITIALIZE_DONE, SET_SALMOS_FILTER } from '../actions';

import { Map } from 'immutable';

const initialState = Map({ salmos: null, salmos_filter: null });

export default function ui(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_DONE:
      return state.set('salmos', action.salmos);
    case SET_SALMOS_FILTER:
      return state.set('salmos_filter', action.filter);
    default:
      return state;
  }
}
