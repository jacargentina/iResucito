import * as React from 'react';
import { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Icon } from '../gluestack';
import {
  SettingsNavigator,
  CommunityNavigator,
  ListsNavigator,
  SongsNavigator,
} from './index';
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
  testID?: string,
  route?: any,
  showTabOnlyOn?: string
) => {
  var tabOptions: BottomTabNavigationOptions = {
    tabBarStyle: {},
    tabBarTestID: testID,
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

export const MenuNavigator = (props: any) => {
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
        options={({ route }) =>
          getTabOptions(SearchIcon, 'songs-tab', route, 'SongSearch')
        }
      />
      <Tab.Screen
        name="Lists"
        component={ListsNavigator}
        options={({ route }) =>
          getTabOptions(BookmarkIcon, 'lists-tab', route, 'ListsSearch')
        }
      />
      <Tab.Screen
        name="Community"
        component={CommunityNavigator}
        options={getTabOptions(UsersIcon, 'community-tab')}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={getTabOptions(SettingsIcon, 'settings-tab')}
      />
    </Tab.Navigator>
  );
};
