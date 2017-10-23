import commonTheme from '../native-base-theme/variables/platform';

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
    headerTruncatedBackTitle: 'Atrás'
  },
  cardStyle: {
    backgroundColor: 'white'
  }
};

export default AppNavigatorConfig;
