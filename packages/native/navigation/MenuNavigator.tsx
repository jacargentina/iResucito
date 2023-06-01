import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Platform, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Icon } from '../gluestack';
import SongsNavigator from './SongsNavigator';
import ListsNavigator from './ListsNavigator';
import CommunityNavigator from './CommunityNavigator';
import SettingsNavigator from './SettingsNavigator';
import { useListsStore } from '../hooks';
import { config } from '../gluestack-ui.config';
import {
  BookmarkIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react-native';

export type MenuParamList = {
  Songs: undefined;
  Lists: undefined;
  Community: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MenuParamList>();

const getTabOptions = (
  IconComponent: any,
  route?: any,
  showTabOnlyOn?: string
) => {
  var tabOptions = {
    tabBarStyle: {},
    tabBarIcon: ({ focused, color, size }) => {
      return (
        <Icon
          as={IconComponent}
          size={size}
          color={color}
          style={{ marginTop: 6 }}
        />
      );
    },
  };
  if (showTabOnlyOn) {
    const n = getFocusedRouteNameFromRoute(route) ?? showTabOnlyOn;
    if (n !== showTabOnlyOn) {
      tabOptions.tabBarStyle = { display: 'none' };
    }
  }
  return tabOptions;
};

var GetScreenOptions = () => {
  var options = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarActiveTintColor: config.theme.tokens.colors.rose600,
    tabBarStyle: {
      backgroundColor: config.theme.tokens.colors.gray50,
      borderTopColor: config.theme.tokens.colors.rose300,
      borderTopWidth: 1,
    },
  };

  if (Platform.OS === 'android') {
    return {
      tabBarInactiveTintColor: 'gray',
      pressColor: config.theme.tokens.colors.rose300,
      iconStyle: {
        height: 30,
      },
      indicatorStyle: {
        backgroundColor: config.theme.tokens.colors.rose600,
        height: 3,
      },
      showIcon: true,
      keyboardHidesTabBar: true,
      ...options,
    };
  }
  return options;
};

const MenuNavigator = (props: any) => {
  const { lists, importList } = useListsStore();
  const { navigation } = props;

  useEffect(() => {
    const handler = (event: { url: string }) => {
      importList(event.url).then((name: string | void) => {
        navigation.navigate('Lists');
        navigation.navigate('ListDetail', { listName: name });
      });
    };
    const subs = Linking.addEventListener('url', handler);
    return function cleanup() {
      subs.remove();
    };
  }, [lists, importList, navigation]);

  return (
    <Tab.Navigator screenOptions={GetScreenOptions()}>
      <Tab.Screen
        name="Songs"
        component={SongsNavigator}
        options={({ route }) => getTabOptions(SearchIcon, route, 'SongSearch')}
      />
      <Tab.Screen
        name="Lists"
        component={ListsNavigator}
        options={({ route }) =>
          getTabOptions(BookmarkIcon, route, 'ListsSearch')
        }
      />
      <Tab.Screen
        name="Community"
        component={CommunityNavigator}
        options={getTabOptions(UsersIcon)}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={getTabOptions(SettingsIcon)}
      />
    </Tab.Navigator>
  );
};

export default MenuNavigator;
