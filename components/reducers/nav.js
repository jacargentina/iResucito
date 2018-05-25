// @flow
import AppNavigator from '../AppNavigator';

const initialState = AppNavigator.router.getStateForAction('Menu');

export default function nav(state = initialState, action) {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
}
