import { INITIALIZE_DONE } from '../actions';

import { Map } from 'immutable';

const initialState = Map({ salmos: null });

export default function ui(state = initialState, action) {
  switch (action.type) {
    case INITIALIZE_DONE:
      return state.set('salmos', action.salmos);
      break;
    default:
      return state;
  }
}
