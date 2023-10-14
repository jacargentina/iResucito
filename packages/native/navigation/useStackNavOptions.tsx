import i18n from '@iresucito/translations';
import { config } from '../config/gluestack-ui.config';
import { StackNavigationOptions } from '@react-navigation/stack';

export const useStackNavOptions = () => {
  let options: StackNavigationOptions = {
    cardStyle: {
      backgroundColor: 'white',
    },
    headerStyle: {
      backgroundColor: config.tokens.colors.rose500,
    },
    headerTitleStyle: {
      color: 'white',
    },
    headerBackTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
    headerBackTitle: i18n.t('ui.back'),
    headerBackTestID: 'back-button',
    headerTruncatedBackTitle: i18n.t('ui.back'),
  };
  return options;
};
