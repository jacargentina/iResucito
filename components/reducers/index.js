// @flow
import { combineReducers } from 'redux';
import { navReducer } from '../AppNavigator';

import ui from './ui';

export default combineReducers({ ui, nav: navReducer });
