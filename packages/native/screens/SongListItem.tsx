import { StackNavigationProp } from '@react-navigation/stack';
import { useState, useMemo } from 'react';
import { Alert, useColorScheme } from 'react-native';
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  Pressable,
  Checkbox,
  useMedia,
} from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import Highlighter from '@javier.alejandro.castro/react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import { AirbnbRating } from 'react-native-ratings';
import { BadgeByStage } from '../badges';
import i18n from '@iresucito/translations';
import { Song } from '@iresucito/core';
import { ChooserParamList } from '../navigation';
import { useSettingsStore, useSongPlayer, useSongsSelection } from '../hooks';
import { config } from '../config/gluestack-ui.config';
import {
  BugIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  StopCircleIcon,
} from 'lucide-react-native';
import { es_audios } from '@iresucito/core';

const NoLocaleWarning = () => {
  return (
    <Pressable
      onPress={() => {
        Alert.alert(
          i18n.t('ui.locale warning title'),
          i18n.t('ui.locale warning message')
        );
      }}>
      <HStack alignItems="center">
        <Icon color="$rose700" as={BugIcon} size="sm" mr="$2" />
        <Text fontSize="$sm" color="$backgroundDark500">
          {i18n.t('ui.locale warning title')}
        </Text>
      </HStack>
    </Pressable>
  );
};

type ViewSongScreenNavigationProp = StackNavigationProp<
  ChooserParamList,
  'ViewSong'
>;

export const SongListItem = (props: {
  song: Song;
  showBadge?: boolean;
  highlight: string;
  viewButton: boolean;
  onPress: any;
  setSongSetting: any;
}) => {
  const media = useMedia();
  const scheme = useColorScheme();
  const navigation = useNavigation<ViewSongScreenNavigationProp>();
  const { ratingsEnabled } = useSettingsStore();
  const { selection, enabled, toggle } = useSongsSelection();
  const { song, highlight, showBadge, viewButton, setSongSetting } = props;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const songPlayer = useSongPlayer();

  const viewSong = () => {
    navigation.navigate('ViewSong', {
      data: {
        title: song.titulo,
        source: song.fuente,
        text: song.fullText,
        stage: song.stage,
      },
    });
  };

  const highlightLines = useMemo(() => {
    if (
      highlight &&
      !song.error &&
      song.fullText.toLowerCase().includes(highlight.toLowerCase())
    ) {
      const lines = song.fullText.split('\n');
      const linesToHighlight = lines.filter((l) =>
        l.toLowerCase().includes(highlight.toLowerCase())
      );
      return linesToHighlight.map((l, i) => {
        return (
          <Highlighter
            id="primeras-lineas"
            key={i}
            autoEscape
            style={{
              color:
                scheme == 'dark'
                  ? config.tokens.colors.textDark100
                  : config.tokens.colors.textDark800,
              fontSize: media.md ? 17 : 12,
            }}
            highlightStyle={{
              backgroundColor:
                scheme == 'dark'
                  ? config.tokens.colors.yellow600
                  : config.tokens.colors.yellow300,
            }}
            searchWords={[highlight]}
            textToHighlight={l}
          />
        );
      });
    }
    return [];
  }, [highlight, song.fullText]);

  const firstHighlighted = useMemo(() => {
    if (highlightLines.length > 0) return highlightLines[0];
  }, [highlightLines]);

  const highlightedRest = useMemo(() => {
    if (highlightLines.length > 1) {
      return (
        <Collapsible collapsed={isCollapsed}>
          {highlightLines.slice(1)}
        </Collapsible>
      );
    }
  }, [highlightLines, isCollapsed]);

  const openHighlightedRest = useMemo(() => {
    if (highlightedRest)
      return (
        <Pressable
          id="resto-lineas"
          onPress={() => setIsCollapsed(!isCollapsed)}>
          <Badge>
            <Badge.Text size={media.md ? '2xl' : 'sm'}>
              {highlightLines.length}+
            </Badge.Text>
          </Badge>
        </Pressable>
      );
  }, [highlightedRest, highlightLines]);

  const widthPercentText = useMemo(() => {
    var value = 100;
    if (showBadge) {
      value -= 10;
    }
    if (viewButton) {
      value -= 10;
    }
    if (openHighlightedRest) {
      value -= 10;
    }
    return value;
  }, [openHighlightedRest]);

  const isSelected = selection.includes(song.key);

  return (
    <Pressable
      testID={`song-${song.titulo}`}
      borderBottomWidth={1}
      $light-borderBottomColor={isSelected ? '$rose200' : '$light200'}
      $dark-borderBottomColor={isSelected ? '$rose200' : '$light600'}
      backgroundColor={isSelected ? '$rose100' : undefined}
      sx={{
        '@base': {
          p: '$2',
        },
        '@md': {
          p: '$3',
        },
      }}
      onPress={() => {
        if (enabled) {
          toggle(song.key);
        } else if (props.onPress) {
          props.onPress(song);
        }
      }}>
      <HStack>
        {showBadge && (
          <Box pt="$2" w="10%">
            <BadgeByStage stage={song.stage} />
          </Box>
        )}
        <VStack space="sm" p="$2" w={`${widthPercentText}%`}>
          <VStack>
            <HStack justifyContent="space-between">
              <Highlighter
                id="titulo"
                autoEscape
                numberOfLines={1}
                style={{
                  fontWeight: 'bold',
                  color:
                    scheme == 'dark'
                      ? config.tokens.colors.textDark100
                      : config.tokens.colors.textDark800,
                  fontSize: media.md ? 26 : 16,
                }}
                highlightStyle={{
                  backgroundColor:
                    scheme == 'dark'
                      ? config.tokens.colors.yellow600
                      : config.tokens.colors.yellow300,
                }}
                searchWords={[highlight]}
                textToHighlight={song.titulo}
              />
              {enabled ? (
                <Checkbox
                  isDisabled
                  value=""
                  isChecked={isSelected}
                  aria-label="Seleccionar"
                />
              ) : null}
            </HStack>
            <Highlighter
              id="fuente"
              autoEscape
              numberOfLines={1}
              style={{
                color:
                  scheme == 'dark'
                    ? config.tokens.colors.backgroundDark300
                    : config.tokens.colors.backgroundDark500,
                paddingVertical: 2,
                fontSize: media.md ? 19 : 14,
              }}
              highlightStyle={{
                backgroundColor:
                  scheme == 'dark'
                    ? config.tokens.colors.yellow600
                    : config.tokens.colors.yellow300,
              }}
              searchWords={[highlight]}
              textToHighlight={song.fuente || '--'}
            />
            {firstHighlighted}
            {highlightedRest}
          </VStack>
          {song.notTranslated && <NoLocaleWarning />}
          {es_audios[song.key] != null ? (
            <HStack>
              <Pressable
                onPress={() =>
                  songPlayer.playingActive && songPlayer.playingKey == song.key
                    ? songPlayer.pause()
                    : songPlayer.play(song.key)
                }>
                <Icon
                  color="$rose700"
                  as={
                    songPlayer.playingActive &&
                    songPlayer.playingKey == song.key
                      ? PauseIcon
                      : PlayIcon
                  }
                  size="xl"
                />
              </Pressable>
              {songPlayer.playingKey == song.key ? (
                <Pressable
                  onPress={() => {
                    songPlayer.stop();
                  }}>
                  <Icon color="$rose700" as={StopCircleIcon} size="xl" />
                </Pressable>
              ) : null}
              {songPlayer.playingKey == song.key ? (
                <Text ml="$1">{songPlayer.playingTimeText}</Text>
              ) : null}
            </HStack>
          ) : null}
          {!enabled && ratingsEnabled && (
            <AirbnbRating
              showRating={false}
              defaultRating={song.rating}
              selectedColor={config.tokens.colors.rose400}
              // @ts-ignore
              unSelectedColor={config.tokens.colors.rose100}
              ratingContainerStyle={{ paddingVertical: 5 }}
              size={25}
              onFinishRating={(position: number) =>
                setSongSetting(song.key, i18n.locale, 'rating', position)
              }
            />
          )}
        </VStack>
        {openHighlightedRest && (
          <Box pt="$2" alignItems="center" w="10%">
            {openHighlightedRest}
          </Box>
        )}
        {viewButton && (
          <Pressable pt="$2" alignItems="center" w="10%" onPress={viewSong}>
            <Icon
              as={EyeIcon}
              color="$rose500"
              size={media.md ? 'xxl' : 'xl'}
            />
          </Pressable>
        )}
        {song.error && (
          <Pressable
            onPress={() => {
              Alert.alert('Error', song.error);
            }}>
            <Icon as={BugIcon} size="xl" />
          </Pressable>
        )}
      </HStack>
    </Pressable>
  );
};
