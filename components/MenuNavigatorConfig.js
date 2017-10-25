import { Platform } from 'react-native';
import commonTheme from '../native-base-theme/variables/platform';
import color from 'color';

var tabBarOptions = {};
tabBarOptions.showLabel = false;

if (Platform.OS == 'android') {
  tabBarOptions.activeTintColor = 'white';
  tabBarOptions.inactiveTintColor = color(tabBarOptions.activeTintColor)
    .darken(0.1)
    .string();
  tabBarOptions.style = {
    backgroundColor: color(commonTheme.brandPrimary)
      .lighten(0.2)
      .string()
  };
  tabBarOptions.iconStyle = {
    height: 30
  };
  tabBarOptions.indicatorStyle = {
    backgroundColor: tabBarOptions.activeTintColor,
    height: 3
  };
  tabBarOptions.showIcon = true;
} else {
  tabBarOptions.activeTintColor = commonTheme.brandPrimary;
  tabBarOptions.style = {
    backgroundColor: 'white'
  };
}

const MenuNavigatorConfig = {
  swipeEnabled: false,
  tabBarOptions: tabBarOptions
};

export default MenuNavigatorConfig;
