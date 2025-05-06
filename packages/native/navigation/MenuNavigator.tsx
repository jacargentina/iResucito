import { useEffect } from 'react';
import { Platform, Linking } from 'react-native';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  getFocusedRouteNameFromRoute,
  NavigatorScreenParams,
} from '@react-navigation/native';
import { Icon, useMedia } from '@gluestack-ui/themed';
import {
  SettingsNavigator,
  CommunityNavigator,
  ListsNavigator,
  SongsNavigator,
  SongsStackParamList,
  ListsStackParamList,
  CommunityStackParamList,
  SettingsStackParamList,
} from './index';
import { useListsStore } from '../hooks';
import { config } from '../config/gluestack-ui.config';
import {
  BookmarkIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from 'lucide-react-native';
import { useColorScheme } from 'react-native';

export type MenuParamList = {
  Songs: NavigatorScreenParams<SongsStackParamList>;
  Lists: NavigatorScreenParams<ListsStackParamList>;
  Community: NavigatorScreenParams<CommunityStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

const Tab = createBottomTabNavigator<MenuParamList>();

const getTabOptions = (
  media: Partial<{
    readonly base: boolean;
    readonly sm: boolean;
    readonly md: boolean;
    readonly lg: boolean;
    readonly xl: boolean;
  }>,
  IconComponent: any,
  testID?: string,
  route?: any,
  showTabOnlyOn?: string
) => {
  var scheme = useColorScheme();
  var tabOptions: BottomTabNavigationOptions = {
    tabBarStyle: media.md
      ? {
          height: 88,
        }
      : undefined,
    tabBarAccessibilityLabel: testID,
    tabBarIcon: ({ color }) => {
      return (
        <Icon
          as={IconComponent}
          color={color}
          // @ts-ignore
          size={media.md ? '45' : undefined}
          style={{ marginTop: 16 }}
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
  tabOptions.tabBarStyle = {
    backgroundColor:
      scheme == 'dark'
        ? config.tokens.colors.backgroundDark900
        : config.tokens.colors.light50,
  };

  return tabOptions;
};

var GetScreenOptions = () => {
  var scheme = useColorScheme();
  var options = {
    headerShown: false,
    tabBarShowLabel: false,
    tabBarActiveTintColor: config.tokens.colors.rose600,
    tabBarStyle: {
      backgroundColor:
        scheme == 'dark'
          ? config.tokens.colors.backgroundDark200
          : config.tokens.colors.light50,
      borderTopColor: config.tokens.colors.rose300,
      borderTopWidth: 1,
    },
  };

  if (Platform.OS === 'android') {
    return {
      tabBarInactiveTintColor: 'gray',
      pressColor: config.tokens.colors.rose300,
      iconStyle: {
        height: 30,
      },
      indicatorStyle: {
        backgroundColor: config.tokens.colors.rose600,
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
  const media = useMedia();
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
          getTabOptions(media, SearchIcon, 'songs-tab', route, 'SongSearch')
        }
      />
      <Tab.Screen
        name="Lists"
        component={ListsNavigator}
        options={({ route }) =>
          getTabOptions(media, BookmarkIcon, 'lists-tab', route, 'ListsSearch')
        }
      />
      <Tab.Screen
        name="Community"
        component={CommunityNavigator}
        options={getTabOptions(media, UsersIcon, 'community-tab')}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={getTabOptions(media, SettingsIcon, 'settings-tab')}
      />
    </Tab.Navigator>
  );
};
