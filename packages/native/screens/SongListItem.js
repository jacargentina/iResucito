// @flow
import * as React from 'react';
import { useContext, useState, useMemo, useEffect } from 'react';
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
import Highlighter from 'react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import { Rating } from 'react-native-rating-element';
import { DataContext } from '../DataContext';
import badges from '../badges';
import I18n from '@iresucito/translations';

const NoLocaleWarning = (): React.Node => {
  return (
    <Pressable
      onPress={() => {
        Alert.alert(
          I18n.t('ui.locale warning title'),
          I18n.t('ui.locale warning message')
        );
      }}>
      <HStack alignItems="center">
        <Icon color="rose.700" as={Ionicons} size="sm" name="bug" mr="2" />
        <Text fontSize={14} color="muted.500">
          {I18n.t('ui.locale warning title')}
        </Text>
      </HStack>
    </Pressable>
  );
};

const SongListItem = (props: any): React.Node => {
  const { colors } = useTheme();
  const data = useContext(DataContext);
  const navigation = useNavigation();
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

  const [firstHighlighted, setFirstHighlighted] = useState();
  const [highlightedRest, setHighlightedRest] = useState();
  const [openHighlightedRest, setOpenHighlightedRest] = useState();

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
        <Box w="10%" pt="2" alignSelf="flex-start">
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
        </Pressable>
        {song.notTranslated && <NoLocaleWarning />}
        <Rating
          readonly={ratingDisabled}
          totalCount={5}
          marginBetweenRatingIcon={3}
          size={20}
          rated={song.rating}
          onIconTap={(position) =>
            setSongSetting(song.key, I18n.locale, 'rating', position)
          }
          ratingColor={colors.rose['500']}
        />
      </VStack>
      {openHighlightedRest && <Box pt="2">{openHighlightedRest}</Box>}
      {viewButton && (
        <Pressable w="10%" onPress={viewSong}>
          <Icon as={Ionicons} color="rose.500" name="eye-outline" size="md" />
        </Pressable>
      )}
      {song.error && (
        <Icon
          as={Ionicons}
          name="bug"
          size="md"
          onPress={() => {
            Alert.alert('Error', song.error);
          }}
        />
      )}
    </HStack>
  );
};

export default SongListItem;
