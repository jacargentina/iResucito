import AppNavigator from '../navigator';

const initialState = AppNavigator.router.getStateForAction('Home');

export default function nav(state = initialState, action) {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  return nextState || state;
}
