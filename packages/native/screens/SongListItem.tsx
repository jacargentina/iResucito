import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useState, useMemo, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  Box,
  Center,
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  Pressable,
  useTheme,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Highlighter from '@javier.alejandro.castro/react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import { Rating } from 'react-native-rating-element';
import { useData } from '../DataContext';
import badges from '../badges';
import i18n from '@iresucito/translations';
import { Song } from '@iresucito/core';
import { ChooserParamList } from '../navigation/SongChooserNavigator';

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
        <Icon color="rose.700" as={Ionicons} size="sm" name="bug" mr="2" />
        <Text fontSize={14} color="muted.500">
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

const SongListItem = (props: any) => {
  const { colors } = useTheme();
  const data = useData();
  const navigation = useNavigation<ViewSongScreenNavigationProp>();
  const {
    highlight,
    songKey,
    songMeta,
    showBadge,
    ratingDisabled,
    viewButton,
  } = props;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const { setSongSetting, songs } = data.songsMeta;

  const song: Song = useMemo(() => {
    if (songKey) {
      return songs.find((i) => i.key === songKey);
    }
    return songMeta;
  }, [songs, songKey, songMeta]);

  const [firstHighlighted, setFirstHighlighted] =
    useState<JSX.Element | void>();
  const [highlightedRest, setHighlightedRest] = useState<JSX.Element | void>();
  const [openHighlightedRest, setOpenHighlightedRest] =
    useState<JSX.Element | void>();

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

  useEffect(() => {
    if (
      highlight &&
      !song.error &&
      song.fullText.toLowerCase().includes(highlight.toLowerCase())
    ) {
      const lines = song.fullText.split('\n');
      const linesToHighlight = lines.filter((l) =>
        l.toLowerCase().includes(highlight.toLowerCase())
      );
      var children = linesToHighlight.map((l, i) => {
        return (
          <Highlighter
            key={i}
            autoEscape
            highlightStyle={{
              backgroundColor: 'yellow',
            }}
            searchWords={[highlight]}
            textToHighlight={l}
          />
        );
      });
      setFirstHighlighted(children.shift());
      if (children.length > 1) {
        setHighlightedRest(
          <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
        );
        setOpenHighlightedRest(
          <Pressable
            onPress={() => {
              setIsCollapsed(!isCollapsed);
            }}>
            <Badge colorScheme="info">
              <Text>{children.length}+</Text>
            </Badge>
          </Pressable>
        );
      }
    } else {
      setFirstHighlighted();
      setHighlightedRest();
      setOpenHighlightedRest();
    }
  }, [highlight, isCollapsed, song.error, song.fullText]);

  if (!song) {
    return (
      <Center p="5">
        <Text>songKey/songMeta not provided</Text>
      </Center>
    );
  }

  var calcWidth = 100;
  if (showBadge) {
    calcWidth -= 10;
  }
  if (viewButton) {
    calcWidth -= 10;
  }
  if (openHighlightedRest) {
    calcWidth -= 10;
  }

  return (
    <HStack p="2" borderBottomWidth={1} borderBottomColor="muted.200">
      {showBadge && (
        <Box pt="2" alignSelf="flex-start">
          {badges[song.stage]}
        </Box>
      )}
      <VStack space={1} p="2" w={`${calcWidth}%`}>
        <Pressable
          onPress={() => {
            if (props.onPress) {
              props.onPress(song);
            }
          }}>
          <>
            <Highlighter
              autoEscape
              numberOfLines={1}
              style={{ fontWeight: 'bold', fontSize: 16 }}
              highlightStyle={{
                backgroundColor: 'yellow',
              }}
              searchWords={[highlight]}
              textToHighlight={song.titulo}
            />
            <Highlighter
              autoEscape
              numberOfLines={1}
              style={{ color: colors.muted['500'], paddingVertical: 2 }}
              highlightStyle={{
                backgroundColor: 'yellow',
              }}
              searchWords={[highlight]}
              textToHighlight={song.fuente || '--'}
            />
            {firstHighlighted}
            {highlightedRest}
          </>
        </Pressable>
        {song.notTranslated && <NoLocaleWarning />}
        <Rating
          readonly={ratingDisabled}
          totalCount={5}
          marginBetweenRatingIcon={3}
          size={20}
          rated={song.rating}
          onIconTap={(position: number) =>
            setSongSetting(song.key, i18n.locale, 'rating', position)
          }
          ratingColor={colors.rose['500']}
        />
      </VStack>
      {openHighlightedRest && <Box pt="2">{openHighlightedRest}</Box>}
      {viewButton && (
        <Pressable w="10%" onPress={viewSong}>
          <Icon as={Ionicons} color="rose.500" name="eye-outline" size="xl" />
        </Pressable>
      )}
      {song.error && (
        <Icon
          as={Ionicons}
          name="bug"
          size="xl"
          onPress={() => {
            Alert.alert('Error', song.error);
          }}
        />
      )}
    </HStack>
  );
};

export default SongListItem;
