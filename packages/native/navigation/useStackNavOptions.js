// @flow
import { useTheme } from 'native-base';
import I18n from '@iresucito/translations';

const useStackNavOptions = (): any => {
  const { colors } = useTheme();

  return {
    cardStyle: {
      backgroundColor: 'white',
    },
    headerStyle: {
      backgroundColor: colors.rose['500'],
    },
    headerTitleStyle: {
      color: 'white',
    },
    headerBackTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
    headerBackTitle: I18n.t('ui.back'),
    headerTruncatedBackTitle: I18n.t('ui.back'),
  };
};

export default useStackNavOptions;
