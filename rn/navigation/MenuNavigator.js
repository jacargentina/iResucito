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

var tabBarOptions = {};
tabBarOptions.showLabel = false;
tabBarOptions.activeTintColor = commonTheme.brandPrimary;
tabBarOptions.style = {
  backgroundColor: 'white',
};

if (Platform.OS === 'android') {
  tabBarOptions.inactiveTintColor = 'gray';
  tabBarOptions.style = {
    backgroundColor: 'white',
  };
  tabBarOptions.pressColor = commonTheme.brandPrimary;
  tabBarOptions.iconStyle = {
    height: 30,
  };
  tabBarOptions.indicatorStyle = {
    backgroundColor: tabBarOptions.activeTintColor,
    height: 3,
  };
  tabBarOptions.showIcon = true;
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
        options={getIcon('contacts')}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={getIcon('settings')}
      />
    </Tab.Navigator>
  );
};

export default MenuNavigator;
