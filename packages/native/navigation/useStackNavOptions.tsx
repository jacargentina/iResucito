import i18n from '@iresucito/translations';
import { config } from '../config/gluestack-ui.config';
import { StackNavigationOptions } from '@react-navigation/stack';
import { useMedia } from '@gluestack-style/react';
import { useColorScheme } from 'react-native';

export const useStackNavOptions = () => {
  const media = useMedia();
  const scheme = useColorScheme();
  let options: StackNavigationOptions = {
    cardStyle: {
      backgroundColor:
        scheme == 'dark' ? config.tokens.colors.backgroundDark900 : 'white',
    },
    headerStyle: {
      backgroundColor:
        scheme == 'dark'
          ? config.tokens.colors.rose900
          : config.tokens.colors.rose500,
    },
    headerTitleStyle: {
      color: 'white',
      fontSize: media.md ? 26 : 18,
      lineHeight: media.md ? 28 : 22,
    },
    headerBackTitleStyle: {
      color: 'white',
      fontSize: media.md ? 24 : 16,
      lineHeight: media.md ? 26 : 20,
    },
    headerTintColor: 'white',
    headerBackTitle: i18n.t('ui.back'),
    headerBackTestID: 'back-button',
    headerTruncatedBackTitle: i18n.t('ui.back'),
  };
  return options;
};
