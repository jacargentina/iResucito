import { useCallback, useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { SongPlayer } from './SongPlayer';
import { SongDownloader } from './SongDownloader';
import { useSongDownloader, useSongPlayer } from '../hooks';

export const DismissableBottom = (props: { children: any }) => {
  const { children } = props;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const songPlayer = useSongPlayer();
  const songDownloader = useSongDownloader();

  const closeCallback = useCallback(
    (actionOnFinish?: () => void) => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 400, // cantidad de pixeles hacia abajo
          duration: 600, // duración en ms
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        actionOnFinish ? actionOnFinish() : null;
      });
    },
    [translateY, opacity]
  );

  const openCallback = useCallback(() => {
    translateY.setValue(400);
    opacity.setValue(0);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  useEffect(() => {
    if (songPlayer.song != null || songDownloader.song != null) {
      openCallback();
    }
    if (songPlayer.song == null && songDownloader.song == null) {
      closeCallback();
    }
  }, [songPlayer.song, songDownloader.song]);

  return (
    <View
      style={{
        position: 'relative',
        flex: 1,
      }}>
      {children}
      <Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 0,
          opacity: opacity,
          transform: [{ translateY: translateY }],
        }}>
        <SongDownloader closeCallback={closeCallback} />
        <SongPlayer closeCallback={closeCallback} />
      </Animated.View>
    </View>
  );
};
