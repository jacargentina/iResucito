/* Apagar warnings de react-native 0.54 */
require('ReactFeatureFlags').warnAboutDeprecatedLifecycles = false;

const { AppRegistry } = require('react-native');
const App = require('./App').default;
AppRegistry.registerComponent('iResucito', () => App);
