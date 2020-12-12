// @flow
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { ListItem, Left, Right, Body, Text, Badge, Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Highlighter from 'react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import commonTheme from '../native-base-theme/variables/platform';
import textTheme from '../native-base-theme/components/Text';
import { Rating } from 'react-native-rating-element';
import { DataContext } from '../DataContext';
import badges from '../badges';
import I18n from '../../translations';

const textStyles = textTheme(commonTheme);
const noteStyles = textStyles['.note'];
delete textStyles['.note'];

const NoLocaleWarning = () => {
  return (
    <TouchableOpacity
      onPress={() => {
        Alert.alert(
          I18n.t('ui.locale warning title'),
          I18n.t('ui.locale warning message')
        );
      }}
      style={{ flex: 1, flexDirection: 'row' }}>
      <Icon
        name="bug"
        style={{
          margin: 5,
          fontSize: 18,
          color: commonTheme.brandPrimary,
        }}
      />
      <Text style={{ ...noteStyles, margin: 5 }}>
        {I18n.t('ui.locale warning title')}
      </Text>
    </TouchableOpacity>
  );
};

const SongListItem = (props: any) => {
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
  const { setSongRating, songs } = data.songsMeta;

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
          <Right>
            <TouchableOpacity
              onPress={() => {
                setIsCollapsed(!isCollapsed);
              }}>
              <Badge warning>
                <Text>{children.length}+</Text>
              </Badge>
            </TouchableOpacity>
          </Right>
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
      <ListItem avatar={showBadge} noIndent>
        <Body>
          <Text>songKey/songMeta not provided</Text>
        </Body>
      </ListItem>
    );
  }

  return (
    <ListItem avatar={showBadge} noIndent>
      {showBadge && <Left>{badges[song.stage]}</Left>}
      <Body>
        <TouchableOpacity
          onPress={() => {
            if (props.onPress) {
              props.onPress(song);
            }
          }}>
          <Highlighter
            numberOfLines={1}
            style={textStyles}
            highlightStyle={{
              backgroundColor: 'yellow',
            }}
            searchWords={[highlight]}
            textToHighlight={song.titulo}
          />
          <Highlighter
            numberOfLines={1}
            style={noteStyles}
            highlightStyle={{
              backgroundColor: 'yellow',
            }}
            searchWords={[highlight]}
            textToHighlight={song.fuente}
          />
          {firstHighlighted}
          {highlightedRest}
        </TouchableOpacity>
        {song.notTranslated && <NoLocaleWarning />}
        <Rating
          readonly={ratingDisabled}
          totalCount={5}
          marginBetweenRatingIcon={3}
          size={20}
          rated={song.rating}
          onIconTap={(position) =>
            setSongRating(song.key, I18n.locale, position)
          }
          ratingColor={commonTheme.brandPrimary}
        />
      </Body>
      {openHighlightedRest}
      {viewButton && (
        <Right>
          <Icon
            name="eye-outline"
            style={{
              fontSize: 32,
              color: commonTheme.brandPrimary,
            }}
            onPress={viewSong}
          />
        </Right>
      )}
      {song.error && (
        <Right>
          <Icon
            name="bug"
            style={{
              fontSize: 32,
              color: commonTheme.brandPrimary,
            }}
            onPress={() => {
              Alert.alert('Error', song.error);
            }}
          />
        </Right>
      )}
    </ListItem>
  );
};

export default SongListItem;
