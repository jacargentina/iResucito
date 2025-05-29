import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { SongPlayer } from './SongPlayer';
import { useSongDownloader, useSongPlayer } from '../hooks';

export const DismissableBottom = (props: { children: any }) => {
  const { children } = props;
  const translateY = useRef(new Animated.Value(400)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false);
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
    if (
      !isOpen &&
      (songPlayer.fileuri != null || songDownloader.downloadItem != null)
    ) {
      setIsOpen(true);
      openCallback();
    }
    if (
      isOpen &&
      songPlayer.fileuri == null &&
      songDownloader.downloadItem == null
    ) {
      setIsOpen(false);
      closeCallback();
    }
  }, [songPlayer.fileuri, songDownloader.downloadItem, isOpen]);

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
        <SongPlayer closeCallback={closeCallback} />
      </Animated.View>
    </View>
  );
};
