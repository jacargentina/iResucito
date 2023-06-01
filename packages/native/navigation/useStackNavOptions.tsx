import i18n from '@iresucito/translations';
import { config } from '../gluestack-ui.config';

export const useStackNavOptions = (): any => {
  return {
    cardStyle: {
      backgroundColor: 'white',
    },
    headerStyle: {
      backgroundColor: config.theme.tokens.colors.rose500,
    },
    headerTitleStyle: {
      color: 'white',
    },
    headerBackTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
    headerBackTitle: i18n.t('ui.back'),
    headerTruncatedBackTitle: i18n.t('ui.back'),
  };
};
