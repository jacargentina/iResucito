import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener
} from 'react-navigation-redux-helpers';

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
);

const addListener = createReduxBoundAddListener('root');

export {
  navMiddleware,
  addListener
};
