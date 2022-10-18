import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { Platform, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Icon, useTheme } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useData } from '../DataContext';
import SongsNavigator from './SongsNavigator';
import ListsNavigator from './ListsNavigator';
import CommunityNavigator from './CommunityNavigator';
import SettingsNavigator from './SettingsNavigator';

const Tab = createBottomTabNavigator();

const getTabOptions = (
  iconName: string,
  route?: any,
  showTabOnlyOn?: string
) => {
  var tabOptions = {
    tabBarStyle: undefined,
    tabBarIcon: ({
      focused,
      color: tabColor,
    }: {
      focused: boolean;
      color: any;
    }) => {
      return (
        <Icon
          as={Ionicons}
          name={iconName}
          active={focused}
          style={{ marginTop: 6, color: tabColor }}
          size={7}
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

const MenuNavigator = (props: any) => {
  const { colors } = useTheme();
  const data = useData();
  const { navigation } = props;
  const { lists, importList } = data.lists;

  var screenOptions = useMemo(() => {
    var options = {
      headerShown: false,
      tabBarShowLabel: false,
      tabBarActiveTintColor: colors.rose['600'],
      tabBarStyle: {
        display: 'flex',
        backgroundColor: colors.gray['50'],
        borderTopColor: colors.rose['300'],
        borderTopWidth: 1,
      },
    };

    if (Platform.OS === 'android') {
      options = {
        inactiveTintColor: 'gray',
        pressColor: colors.rose['300'],
        iconStyle: {
          height: 30,
        },
        indicatorStyle: {
          backgroundColor: colors.rose['600'],
          height: 3,
        },
        showIcon: true,
        keyboardHidesTabBar: true,
        ...options,
      };
    }
    return options;
  }, [colors]);

  useEffect(() => {
    const handler = (event) => {
      importList(event.url).then((name) => {
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
    <Tab.Navigator swipeEnabled={false} screenOptions={screenOptions}>
      <Tab.Screen
        name="Songs"
        component={SongsNavigator}
        options={({ route }) => getTabOptions('search', route, 'SongSearch')}
      />
      <Tab.Screen
        name="Lists"
        component={ListsNavigator}
        options={({ route }) =>
          getTabOptions('bookmarks-outline', route, 'ListsSearch')
        }
      />
      <Tab.Screen
        name="Community"
        component={CommunityNavigator}
        options={getTabOptions('people-outline')}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={getTabOptions('settings-outline')}
      />
    </Tab.Navigator>
  );
};

export default MenuNavigator;
