// @flow
import React, { useContext, useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'native-base';
import commonTheme from '../native-base-theme/variables/platform';
import SongsNavigator from './SongsNavigator';
import ListsNavigator from './ListsNavigator';
import CommunityNavigator from './CommunityNavigator';
import SettingsNavigator from './SettingsNavigator';
import { DataContext } from '../DataContext';
import color from 'color';

var tabBarOptions = {};
tabBarOptions.showLabel = false;
tabBarOptions.activeTintColor = commonTheme.brandPrimary;
tabBarOptions.style = {
  backgroundColor: 'white',
  borderTopColor: color(commonTheme.brandPrimary).lighten(0.2).string(),
  borderTopWidth: 1,
  marginTop: 2,
};

if (Platform.OS === 'android') {
  tabBarOptions.inactiveTintColor = 'gray';
  tabBarOptions.pressColor = commonTheme.brandPrimary;
  tabBarOptions.iconStyle = {
    height: 30,
  };
  tabBarOptions.indicatorStyle = {
    backgroundColor: tabBarOptions.activeTintColor,
    height: 3,
  };
  tabBarOptions.showIcon = true;
  tabBarOptions.keyboardHidesTabBar = true;
}

const Tab = createBottomTabNavigator();

const getIcon = (iconName) => {
  return {
    tabBarIcon: ({ focused, color }) => {
      return (
        <Icon
          name={iconName}
          active={focused}
          style={{ marginTop: 6, color: color }}
          type="FontAwesome"
        />
      );
    },
  };
};

const MenuNavigator = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const { lists, importList } = data.lists;

  useEffect(() => {
    const handler = (event) => {
      importList(event.url).then((name) => {
        navigation.navigate('Lists');
        navigation.navigate('ListDetail', { listName: name });
      });
    };
    Linking.addEventListener('url', handler);
    return function cleanup() {
      Linking.removeEventListener('url', handler);
    };
  }, [lists]);

  return (
    <Tab.Navigator swipeEnabled={false} tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name="Songs"
        component={SongsNavigator}
        options={getIcon('search')}
      />
      <Tab.Screen
        name="Lists"
        component={ListsNavigator}
        options={getIcon('bookmark')}
      />
      <Tab.Screen
        name="Community"
        component={CommunityNavigator}
        options={getIcon('address-book')}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={getIcon('cog')}
      />
    </Tab.Navigator>
  );
};

export default MenuNavigator;
