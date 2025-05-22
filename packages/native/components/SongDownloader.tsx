import { Animated, Pressable } from 'react-native';
import { Text, HStack, Icon, VStack, useMedia } from '@gluestack-ui/themed';
import color from 'color';
import { useSongDownloader } from '../hooks';
import { XIcon, CloudDownloadIcon } from 'lucide-react-native';
import { colors } from '@iresucito/core';
import { NativeStyles } from '../util';
import i18n from '@iresucito/translations';
import { useCallback, useRef } from 'react';

export const SongDownloader = () => {
  const songDownloader = useSongDownloader();
  const media = useMedia();

  const translateY = useRef(new Animated.Value(0));
  const opacity = useRef(new Animated.Value(1));

  const detenerConAnimacion = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY.current, {
        toValue: 300, // cantidad de pixeles hacia abajo
        duration: 600, // duración en ms
        useNativeDriver: true,
      }),
      Animated.timing(opacity.current, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      songDownloader.stop();
      translateY.current = new Animated.Value(0);
      opacity.current = new Animated.Value(1);
    });
  }, [songDownloader]);

  if (songDownloader.song == null) {
    return null;
  }

  const backColor = color(colors[songDownloader.song.stage]);
  const background = backColor.lighten(0.1).string();

  return (
    <Animated.View
      style={{
        opacity: opacity.current,
        transform: [{ translateY: translateY.current }],
      }}>
      <VStack
        p="$4"
        borderTopWidth={1}
        bgColor={background}
        borderTopColor="$rose300">
        <HStack justifyContent="space-between">
          <Text
            numberOfLines={1}
            pb="$4"
            style={{
              fontWeight: 'bold',
              color: NativeStyles.title.color,
              fontSize: media.md ? 28 : 18,
            }}>
            {songDownloader.song.titulo}
          </Text>
          <Pressable onPress={detenerConAnimacion}>
            <Icon color="$rose500" as={XIcon} size="xl" />
          </Pressable>
        </HStack>
        <HStack>
          <Icon color="$rose500" mr="$2" as={CloudDownloadIcon} size="xl" />
          <Text color="$rose500">{i18n.t('ui.downloading')}</Text>
        </HStack>
      </VStack>
    </Animated.View>
  );
};
