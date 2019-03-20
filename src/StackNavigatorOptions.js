// @flow
import commonTheme from './native-base-theme/variables/platform';
import I18n from './translations';

const StackNavigatorOptions = {
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
};

export default StackNavigatorOptions;
