import { Pressable } from 'react-native';
import {
  Text,
  HStack,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  VStack,
  useMedia,
} from '@gluestack-ui/themed';
import color from 'color';
import { useSongDownloader, useSongPlayer } from '../hooks';
import { PauseIcon, PlayIcon, XIcon } from 'lucide-react-native';
import { colors } from '@iresucito/core';
import { NativeStyles } from '../util';
import { useRef } from 'react';

export const SongPlayer = () => {
  const songPlayer = useSongPlayer();
  const media = useMedia();
  const sliderRef = useRef<any>(null);
  const wasChangedRef = useRef(false);

  if (songPlayer.song == null) {
    return null;
  }

  const backColor = color(colors[songPlayer.song.stage]);
  const background = backColor.lighten(0.1).string();

  return (
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
          {songPlayer.song.titulo}
        </Text>
        <Pressable
          onPress={() => {
            songPlayer.stop();
          }}>
          <Icon color="$rose500" as={XIcon} size="xl" />
        </Pressable>
      </HStack>
      <HStack>
        <Pressable
          onPress={() =>
            songPlayer.player.playing ? songPlayer.pause() : songPlayer.play()
          }>
          <Icon
            color="$rose500"
            mr="$2"
            as={songPlayer.player.playing ? PauseIcon : PlayIcon}
            size="xl"
          />
        </Pressable>
        <Slider
          ref={sliderRef}
          w="90%"
          bg="$rose200"
          borderRadius={10}
          value={songPlayer.playingTimePercent}
          onChange={(value) => {
            wasChangedRef.current = true;
            songPlayer.seek(value);
          }}
          onTouchStart={() => {
            wasChangedRef.current = false;
          }}
          onTouchEnd={(evt) => {
            if (wasChangedRef.current == false) {
              sliderRef.current?.measure(
                (x, y, width, height, pageX, pageY) => {
                  const percent = (evt.nativeEvent.locationX / width) * 100;
                  songPlayer.seek(percent);
                }
              );
            }
          }}
          minValue={0}
          maxValue={100}
          size="sm"
          orientation="horizontal">
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </HStack>
      {songPlayer.playingActive && (
        <Text
          textAlign="right"
          pt="$2"
          fontSize="$sm"
          numberOfLines={1}
          style={{ color: NativeStyles.normalLine.color }}>
          {songPlayer.playingTimeText}
        </Text>
      )}
    </VStack>
  );
};
