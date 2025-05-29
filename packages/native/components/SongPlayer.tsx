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
import { useSongDownloader, useSongPlayer } from '../hooks';
import {
  PauseIcon,
  PlayIcon,
  XIcon,
  CloudDownloadIcon,
} from 'lucide-react-native';
import { useRef } from 'react';
import i18n from '@iresucito/translations';

export const SongPlayer = (props: { closeCallback: () => void }) => {
  const { closeCallback } = props;
  const songPlayer = useSongPlayer();
  const songDownloader = useSongDownloader();
  const media = useMedia();
  const sliderRef = useRef<any>(null);
  const wasChangedRef = useRef(false);

  return (
    <VStack
      p="$4"
      borderTopWidth={1}
      $dark-bg="$backgroundDark800"
      $light-bg="white"
      $light-borderTopColor="$light200"
      $dark-borderTopColor="$light600">
      <HStack justifyContent="space-between">
        <Text
          numberOfLines={1}
          pb="$4"
          style={{
            fontWeight: 'bold',
            fontSize: media.md ? 28 : 18,
          }}>
          {songDownloader.downloadItem != null
            ? songDownloader.title
            : songPlayer.title}
        </Text>
        <Pressable
          onPress={() => {
            if (songDownloader.downloadItem != null) {
              songDownloader.stop();
            }
            songPlayer.stop();
            closeCallback();
          }}>
          <Icon color="$rose500" as={XIcon} size="xl" />
        </Pressable>
      </HStack>
      {songDownloader.downloadItem != null ? (
        <HStack>
          <Icon color="$rose500" mr="$2" as={CloudDownloadIcon} size="xl" />
          <Text $dark-color="white" $light-color="black">
            {i18n.t('ui.downloading')}
          </Text>
        </HStack>
      ) : (
        <HStack>
          <Pressable onPress={songPlayer.togglepause}>
            <Icon
              color="$rose500"
              mr="$2"
              as={
                songPlayer.refreshIntervalId != undefined ? PauseIcon : PlayIcon
              }
              size="xl"
            />
          </Pressable>
          <Slider
            ref={sliderRef}
            w="90%"
            bg="$rose100"
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
            minValue={-4}
            maxValue={104}
            size="sm"
            orientation="horizontal">
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb
              borderRadius={5}
              shadowRadius={0}
              shadowOffset={{ width: 0, height: 0 }}
            />
          </Slider>
        </HStack>
      )}
      {songDownloader.downloadItem == null ? (
        <Text
          textAlign="right"
          pt="$2"
          fontSize="$sm"
          numberOfLines={1}
          color="white">
          {songPlayer.playingTimeText}
        </Text>
      ) : null}
    </VStack>
  );
};
