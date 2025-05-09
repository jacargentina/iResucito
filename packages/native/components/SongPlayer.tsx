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
import { useSongPlayer } from '../hooks';
import { PauseIcon, PlayIcon, XIcon } from 'lucide-react-native';
import { config } from '../config/gluestack-ui.config';

export const SongPlayer = () => {
  const songPlayer = useSongPlayer();
  const scheme = useColorScheme();
  const media = useMedia();

  if (songPlayer.song == null) {
    return null;
  }

  return (
    <VStack
      p="$4"
      borderTopWidth={1}
      $light-bgColor="$backgroundDark50"
      $light-borderTopColor="$rose300"
      $dark-borderTopColor="$rose300">
      <HStack justifyContent="space-between">
        <Text
          numberOfLines={1}
          pb="$4"
          style={{
            fontWeight: 'bold',
            color:
              scheme == 'dark'
                ? config.tokens.colors.textDark100
                : config.tokens.colors.textDark800,
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
          $light-bg="$backgroundDark200"
          $dark-bg="$backgroundDark200"
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
      <Text textAlign="right" pt="$2" fontSize="$sm" numberOfLines={1}>
        {songPlayer.playingTimeText}
      </Text>
    </VStack>
  );
};
