import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from 'sentry-expo';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { MenuProvider } from 'react-native-popup-menu';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { extendedConfig } from './Config';
import { RootNavigator } from './navigation';

Sentry.init({
  dsn: 'https://645393af749a4f3da9d8074330a25da3@o469156.ingest.sentry.io/5498083',
  enableInExpoDevelopment: true,
});

SplashScreen.preventAutoHideAsync();

const App = () => {
  return (
    <GluestackUIProvider config={extendedConfig}>
      <MenuProvider backHandler={true}>
        <NavigationContainer
          onReady={() => {
            /* Para evitar efecto de 'salto' en layout de android
             * y efecto 'aplicar idioma' en ambas plataformas
             * esperar un segundo y medio antes de ocultar */
            setTimeout(() => {
              SplashScreen.hideAsync();
            }, 1500);
          }}>
          <RootNavigator />
        </NavigationContainer>
        <StatusBar style="light" />
      </MenuProvider>
    </GluestackUIProvider>
  );
};

export default App;
