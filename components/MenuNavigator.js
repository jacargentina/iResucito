// @flow
import { Platform } from 'react-native';
import commonTheme from '../native-base-theme/variables/platform';
import { createBottomTabNavigator } from 'react-navigation';
import SalmoSearch from './screens/SalmoSearch';
import SettingsScreen from './screens/SettingsScreen';
import ListScreen from './screens/ListScreen';
import CommunityScreen from './screens/CommunityScreen';

var tabBarOptions = {};
tabBarOptions.showLabel = false;
tabBarOptions.activeTintColor = commonTheme.brandPrimary;
tabBarOptions.style = {
  backgroundColor: 'white'
};

if (Platform.OS == 'android') {
  tabBarOptions.inactiveTintColor = 'gray';
  tabBarOptions.style = {
    backgroundColor: 'white'
  };
  tabBarOptions.pressColor = commonTheme.brandPrimary;
  tabBarOptions.iconStyle = {
    height: 30
  };
  tabBarOptions.indicatorStyle = {
    backgroundColor: tabBarOptions.activeTintColor,
    height: 3
  };
  tabBarOptions.showIcon = true;
}

const MenuNavigator = createBottomTabNavigator(
  {
    Search: { screen: SalmoSearch },
    Lists: { screen: ListScreen },
    Community: { screen: CommunityScreen },
    Settings: { screen: SettingsScreen }
  },
  {
    swipeEnabled: false,
    tabBarOptions: tabBarOptions,
    defaultNavigationOptions: (props: any) => {
      var navigation = props.navigation;
      switch (navigation.state.routeName) {
        case 'Search':
          return SalmoSearch.navigationOptions;
        case 'Lists':
          return ListScreen.navigationOptions;
        case 'Community':
          return CommunityScreen.navigationOptions;
        case 'Settings':
          return SettingsScreen.navigationOptions;
      }
      return null;
    }
  }
);

export default MenuNavigator;
