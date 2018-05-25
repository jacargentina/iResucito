// @flow
import { combineReducers } from 'redux';

import ui from './ui';
import nav from './nav';

export default combineReducers({ ui, nav });
