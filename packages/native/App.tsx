import { NavigationContainer } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { MenuProvider } from 'react-native-popup-menu';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './config/gluestack-ui.config';
import { RootNavigator } from './navigation/RootNavigator';
import { useFonts } from 'expo-font';
import { AppState, useColorScheme } from 'react-native';
import { useEffect, useRef } from 'react';
import { useSongPlayer } from './hooks';

Sentry.init({
  dsn: 'https://645393af749a4f3da9d8074330a25da3@o469156.ingest.sentry.io/5498083',
  enabled: __DEV__,
});

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [fontsLoaded] = useFonts({
    'Franklin Gothic Medium': require('./fonts/FranklinGothicMedium.ttf'),
    'Franklin Gothic Regular': require('./fonts/FranklinGothicRegular.ttf'),
  });

  const appState = useRef(AppState.currentState);
  const songPlayer = useSongPlayer();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('AppState volvió a active: Player currentStatus:');
        console.log(songPlayer.player.currentStatus);
        console.log('-----');
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const scheme = useColorScheme();
  const colorMode = scheme == null ? undefined : scheme;
  return (
    <GluestackUIProvider colorMode={colorMode} config={config}>
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
        <StatusBar hidden />
      </MenuProvider>
    </GluestackUIProvider>
  );
};

export default Sentry.wrap(App);
