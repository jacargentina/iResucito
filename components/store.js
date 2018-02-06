import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';
import reducer from './reducers';

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);

let Store = createStore(reducer, applyMiddleware(thunk, navMiddleware));

export default Store;
