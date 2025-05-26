import { Pressable } from 'react-native';
import { Text, HStack, Icon, VStack, useMedia } from '@gluestack-ui/themed';
import { useSongDownloader } from '../hooks';
import { XIcon, CloudDownloadIcon } from 'lucide-react-native';
import i18n from '@iresucito/translations';

export const SongDownloader = (props: {
  closeCallback: (actionOnFinish: () => void) => void;
}) => {
  const { closeCallback } = props;
  const songDownloader = useSongDownloader();
  const media = useMedia();

  if (songDownloader.song == null) {
    return null;
  }

  return (
    <VStack
      w="$full"
      p="$4"
      $dark-bg="$backgroundDark800"
      $light-bg="white"
      borderTopWidth={1}
      $light-borderTopColor="$light200"
      $dark-borderTopColor="$light600">
      <HStack justifyContent="space-between">
        <Text
          numberOfLines={1}
          pb="$4"
          $dark-color="white"
          $light-color="black"
          fontWeight="bold"
          fontSize={media.md ? 28 : 18}>
          {songDownloader.song.titulo}
        </Text>
        <Pressable
          onPress={() =>
            closeCallback(() => {
              songDownloader.stop();
            })
          }>
          <Icon color="$rose500" as={XIcon} size="xl" />
        </Pressable>
      </HStack>
      <HStack>
        <Icon color="$rose500" mr="$2" as={CloudDownloadIcon} size="xl" />
        <Text $dark-color="white" $light-color="black">
          {i18n.t('ui.downloading')}
        </Text>
      </HStack>
    </VStack>
  );
};
