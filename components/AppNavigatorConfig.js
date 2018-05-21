import commonTheme from '../native-base-theme/variables/platform';
import I18n from './translations';
import MenuNavigator from './MenuNavigator';

const AppNavigatorConfig = {
  navigationOptions: ({ navigation }) => {
    var options = {
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
    if (typeof navigation.state.index == 'number') {
      var current = navigation.state.routes[navigation.state.index];
      var screen = MenuNavigator.router.getComponentForRouteName(current.key);
      options.title = screen.navigationOptions().title;
      console.log('assigned title', options.title, I18n.locale);
    }
    return options;
  },
  cardStyle: {
    backgroundColor: 'white'
  }
};

export default AppNavigatorConfig;
