import commonTheme from '../native-base-theme/variables/platform';
import I18n from './translations';

const AppNavigatorConfig = {
  navigationOptions: {
    headerStyle: {
      backgroundColor: commonTheme.brandPrimary
    },
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    },
    headerTintColor: 'white',
    headerTruncatedBackTitle: I18n.t('ui.back')
  },
  cardStyle: {
    backgroundColor: 'white'
  }
};

export default AppNavigatorConfig;
