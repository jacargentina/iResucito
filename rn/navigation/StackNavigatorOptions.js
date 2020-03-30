// @flow
import commonTheme from '../native-base-theme/variables/platform';
import I18n from '../../translations';

const StackNavigatorOptions = () => ({
  cardStyle: {
    backgroundColor: 'white',
  },
  headerStyle: {
    backgroundColor: commonTheme.brandPrimary,
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
});

export default StackNavigatorOptions;
