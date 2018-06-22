// @flow
import { createBottomTabNavigator } from 'react-navigation';
import { createNavigationReducer } from 'react-navigation-redux-helpers';
import SalmoSearch from './screens/SalmoSearch';
import SettingsScreen from './screens/SettingsScreen';
import ListScreen from './screens/ListScreen';
import CommunityScreen from './screens/CommunityScreen';
import MenuNavigatorConfig from './MenuNavigatorConfig';

const MenuNavigator = createBottomTabNavigator(
  {
    Search: { screen: SalmoSearch },
    Lists: { screen: ListScreen },
    Community: { screen: CommunityScreen },
    Settings: { screen: SettingsScreen }
  },
  MenuNavigatorConfig
);

const navReducer = createNavigationReducer(MenuNavigator);

export { MenuNavigator, navReducer };
