// @flow
import { useTheme } from 'native-base';
import { TransitionPresets } from '@react-navigation/stack';
import I18n from '../../translations';

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
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default useStackNavOptions;
