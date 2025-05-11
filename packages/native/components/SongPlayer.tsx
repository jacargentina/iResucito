import { Pressable, useColorScheme } from 'react-native';
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
import { useSongPlayer } from '../hooks';
import { PauseIcon, PlayIcon, XIcon } from 'lucide-react-native';
import { config } from '../config/gluestack-ui.config';
import { colors } from '@iresucito/core';
import { NativeStyles } from '../util';

export const SongPlayer = () => {
  const songPlayer = useSongPlayer();
  const scheme = useColorScheme();
  const media = useMedia();

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
          <Icon color="$rose700" as={XIcon} size="xl" />
        </Pressable>
      </HStack>
      <HStack>
        <Pressable
          onPress={() =>
            songPlayer.playingActive ? songPlayer.pause() : songPlayer.play()
          }>
          <Icon
            color="$rose700"
            mr="$2"
            as={songPlayer.playingActive ? PauseIcon : PlayIcon}
            size="xl"
          />
        </Pressable>
        <Slider
          w="90%"
          bg="$backgroundDark200"
          borderRadius={10}
          value={songPlayer.playingTimePercent}
          onChange={(value) => songPlayer.seek(value)}
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
      <Text
        textAlign="right"
        pt="$2"
        fontSize="$sm"
        numberOfLines={1}
        style={{ color: NativeStyles.normalLine.color }}>
        {songPlayer.playingTimeText}
      </Text>
    </VStack>
  );
};
