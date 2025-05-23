import { Pressable } from 'react-native';
import { Text, HStack, Icon, VStack, useMedia } from '@gluestack-ui/themed';
import color from 'color';
import { useSongDownloader } from '../hooks';
import { XIcon, CloudDownloadIcon } from 'lucide-react-native';
import { colors } from '@iresucito/core';
import { NativeStyles } from '../util';
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

  const backColor = color(colors[songDownloader.song.stage]);
  const background = backColor.lighten(0.1).string();

  return (
    <VStack
      w="$full"
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
        <Text color="$rose500">{i18n.t('ui.downloading')}</Text>
      </HStack>
    </VStack>
  );
};
