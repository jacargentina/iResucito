import i18n from '@iresucito/translations';
import { config } from '../config/gluestack-ui.config';
import { StackNavigationOptions } from '@react-navigation/stack';
import { useMedia } from '@gluestack-style/react';

export const useStackNavOptions = () => {
  const media = useMedia();
  let options: StackNavigationOptions = {
    cardStyle: {
      backgroundColor: 'white',
    },
    headerStyle: {
      backgroundColor: config.tokens.colors.rose500,
      height: media.md ? 75 : undefined,
    },
    headerTitleStyle: {
      color: 'white',
      fontSize: media.md ? 26 : undefined,
      lineHeight: media.md ? 28 : undefined,
    },
    headerBackTitleStyle: {
      color: 'white',
      fontSize: media.md ? 24 : undefined,
      lineHeight: media.md ? 26 : undefined,
    },
    headerTintColor: 'white',
    headerBackTitle: i18n.t('ui.back'),
    headerBackTestID: 'back-button',
    headerTruncatedBackTitle: i18n.t('ui.back'),
  };
  return options;
};
