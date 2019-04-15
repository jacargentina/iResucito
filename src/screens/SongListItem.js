// @flow
import React, { useContext, useState, useEffect } from 'react';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, Alert } from 'react-native';
import {
  ListItem,
  Left,
  Right,
  Body,
  Text,
  Badge,
  Icon,
  ActionSheet
} from 'native-base';
import Highlighter from 'react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import badges from '../badges';
import commonTheme from '../native-base-theme/variables/platform';
import textTheme from '../native-base-theme/components/Text';
import StarRating from 'react-native-star-rating';
import I18n from '../translations';
import { DataContext } from '../DataContext';

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
          color: commonTheme.brandPrimary
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
  const {
    navigation,
    highlight,
    song,
    showBadge,
    devModeDisabled,
    patchSectionDisabled
  } = props;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { keys } = data.settings;
  const { getSongLocalePatch, setSongLocalePatch } = data.songsMeta;
  const [developerMode, setDeveloperMode] = useState();
  const [firstHighlighted, setFirstHighlighted] = useState();
  const [highlightedRest, setHighlightedRest] = useState();
  const [openHighlightedRest, setOpenHighlightedRest] = useState();
  const notUsingSpanish = I18n.locale.split('-')[0] !== 'es';

  const showDeveloperMenu = () => {
    var options = [I18n.t('ui.rename'), I18n.t('ui.edit')];
    if (song.locale !== 'es') {
      options.push(I18n.t('ui.link file'));
    }
    if (song.patched) {
      options.push(I18n.t('ui.remove patch'));
    }
    options.push(I18n.t('ui.cancel'));
    ActionSheet.show(
      {
        options: options,
        cancelButtonIndex: options.indexOf(I18n.t('ui.cancel')),
        title: I18n.t('settings_title.developer mode')
      },
      index => {
        index = Number(index);
        const title = options[index];
        switch (title) {
          case I18n.t('ui.rename'):
            changeName();
            break;
          case I18n.t('ui.edit'):
            showEditor();
            break;
          case I18n.t('ui.link file'):
            linkPatch();
            break;
          case I18n.t('ui.remove patch'):
            confirmClearSongPatch();
            break;
        }
      }
    );
  };

  const linkPatch = () => {
    navigation.navigate('SongChooseLocale', {
      target: song,
      targetType: 'song'
    });
  };

  const changeName = () => {
    getSongLocalePatch(song).then(patchObj => {
      var file = song.nombre;
      var rename = undefined;
      if (patchObj && patchObj[I18n.locale]) {
        file = patchObj[I18n.locale].file;
        rename = patchObj[I18n.locale].rename;
      }
      // Definir cambio a realizar sobre el patch
      const applyChanges = renameTo => {
        setSongLocalePatch(song, file, renameTo);
      };
      navigation.navigate('SongChangeName', {
        song: song,
        nameToEdit: rename ? rename : file,
        action: applyChanges
      });
    });
  };

  const showEditor = () => {
    navigation.navigate('SongEditor', {
      song: song
    });
  };

  const confirmClearSongPatch = () => {
    Alert.alert(
      I18n.t('ui.confirmation'),
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          style: 'destructive',
          onPress: () => {
            setSongLocalePatch(song, undefined);
          }
        },
        {
          text: I18n.t('ui.cancel'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    var isOn = devModeDisabled === true ? false : keys.developerMode;
    setDeveloperMode(isOn);
  }, [keys.developerMode]);

  useEffect(() => {
    if (
      highlight &&
      !song.error &&
      song.fullText.toLowerCase().includes(highlight.toLowerCase())
    ) {
      var linesToHighlight = song.lines.filter(l =>
        l.toLowerCase().includes(highlight.toLowerCase())
      );
      var children = linesToHighlight.map((l, i) => {
        return (
          <Highlighter
            key={i}
            highlightStyle={{
              backgroundColor: 'yellow'
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
    }
  }, [highlight, developerMode]);

  return (
    <ListItem avatar={showBadge} noIndent>
      {showBadge && <Left>{badges[song.etapa]}</Left>}
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
              backgroundColor: 'yellow'
            }}
            searchWords={[highlight]}
            textToHighlight={song.titulo}
          />
          <Highlighter
            numberOfLines={1}
            style={noteStyles}
            highlightStyle={{
              backgroundColor: 'yellow'
            }}
            searchWords={[highlight]}
            textToHighlight={song.fuente}
          />
          {firstHighlighted}
          {highlightedRest}
        </TouchableOpacity>
        {developerMode && !patchSectionDisabled && song.patched && (
          <Text style={{ ...noteStyles, margin: 5 }}>
            {I18n.t('ui.original song')}: {song.patchedTitle}
          </Text>
        )}
        {!patchSectionDisabled &&
          notUsingSpanish &&
          song.locale !== I18n.locale && <NoLocaleWarning />}
        <StarRating
          containerStyle={{ paddingTop: 10, width: '50%' }}
          disabled={true}
          maxStars={5}
          starSize={15}
          rating={song.rating}
          fullStarColor={commonTheme.brandPrimary}
        />
      </Body>
      {openHighlightedRest}
      {developerMode && !patchSectionDisabled && (
        <Right>
          <Icon
            name="more"
            style={{
              color: commonTheme.brandPrimary
            }}
            onPress={showDeveloperMenu}
          />
        </Right>
      )}
      {song.error && (
        <Right>
          <Icon
            name="bug"
            style={{
              fontSize: 32,
              color: commonTheme.brandPrimary
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

export default withNavigation(SongListItem);
