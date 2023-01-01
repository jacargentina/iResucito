import { useTheme } from 'native-base';
import i18n from '@iresucito/translations';

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
    headerBackTitle: i18n.t('ui.back'),
    headerTruncatedBackTitle: i18n.t('ui.back'),
  };
};

export default useStackNavOptions;
