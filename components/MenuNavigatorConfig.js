import { Platform } from 'react-native';
import commonTheme from '../native-base-theme/variables/platform';

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

const MenuNavigatorConfig = {
  swipeEnabled: false,
  tabBarOptions: tabBarOptions
};

export default MenuNavigatorConfig;
