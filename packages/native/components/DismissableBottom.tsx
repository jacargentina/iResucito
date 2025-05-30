import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';
import { SongPlayer } from './SongPlayer';
import { useSongDownloader, useSongPlayer } from '../hooks';

export const DismissableBottom = (props: { children: any }) => {
  const { children } = props;
  const { fileuri } = useSongPlayer();
  const { downloadItem } = useSongDownloader();
  const [isOpen, setIsOpen] = useState(fileuri != null);
  const translateY = useRef(new Animated.Value(isOpen ? 0 : 400)).current;
  const opacity = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  const closeCallback = useCallback(() => {
    setIsOpen(false);
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
    ]).start();
  }, [translateY, opacity]);

  const openCallback = useCallback(() => {
    setIsOpen(true);
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
    if (!isOpen && (fileuri != null || downloadItem != null)) {
      openCallback();
    }
  }, [fileuri, downloadItem, isOpen]);

  useEffect(() => {
    if (isOpen && fileuri == null && downloadItem == null) {
      closeCallback();
    }
  }, [fileuri, isOpen]);

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
