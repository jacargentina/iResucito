// @flow
import React, { useContext, useState, useEffect } from 'react';
import { withNavigation } from 'react-navigation';
import { TouchableOpacity, Alert } from 'react-native';
import { ListItem, Left, Right, Body, Text, Badge, Icon } from 'native-base';
import Highlighter from 'react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import badges from '../badges';
import commonTheme from '../native-base-theme/variables/platform';
import textTheme from '../native-base-theme/components/Text';
import I18n from '../translations';
import { DataContext } from '../DataContext';

const textStyles = textTheme(commonTheme);
const noteStyles = textStyles['.note'];
delete textStyles['.note'];

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
  const { setSongLocalePatch } = data.songsMeta;
  const [developerMode, setDeveloperMode] = useState();
  const [firstHighlighted, setFirstHighlighted] = useState();
  const [highlightedRest, setHighlightedRest] = useState();
  const [openHighlightedRest, setOpenHighlightedRest] = useState();
  const [patchableSection, setPatchableSection] = useState();
  const [chooseFileForLocale, setChooseFileForLocale] = useState();

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

  useEffect(() => {
    if (
      developerMode === true &&
      song.patchable &&
      !openHighlightedRest &&
      !patchSectionDisabled
    ) {
      if (song.patched) {
        setPatchableSection(
          <TouchableOpacity
            onPress={() => setSongLocalePatch(song, undefined)}
            style={{ flex: 1, flexDirection: 'row-reverse' }}>
            <Icon
              name="trash"
              style={{
                marginTop: 2,
                marginRight: 20,
                fontSize: 20,
                color: commonTheme.brandPrimary
              }}
            />
            <Text style={{ ...noteStyles, marginRight: 5, marginTop: 5 }}>
              {song.patchedTitle}
            </Text>
          </TouchableOpacity>
        );
      } else {
        setChooseFileForLocale(
          <Right>
            <Icon
              name="link"
              style={{
                fontSize: 32,
                color: commonTheme.brandPrimary
              }}
              onPress={() =>
                navigation.navigate('SongChooseLocale', {
                  target: song,
                  targetType: 'song'
                })
              }
            />
          </Right>
        );
      }
    }
    if (song.patchable && developerMode === false && !patchSectionDisabled) {
      setPatchableSection(
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              I18n.t('ui.locale warning title'),
              I18n.t('ui.locale warning message')
            );
          }}
          style={{ flex: 1, flexDirection: 'row-reverse' }}>
          <Icon
            name="bug"
            style={{
              marginTop: 2,
              marginRight: 20,
              fontSize: 20,
              color: commonTheme.brandPrimary
            }}
          />
          <Text style={{ ...noteStyles, marginRight: 5, marginTop: 5 }}>
            {I18n.t('ui.locale warning title')}
          </Text>
        </TouchableOpacity>
      );
    }
  }, [
    developerMode,
    patchSectionDisabled,
    song.patchable,
    openHighlightedRest
  ]);

  return (
    <ListItem avatar={showBadge} style={{ paddingHorizontal: 5 }}>
      {showBadge && (
        <Left style={{ marginLeft: -8 }}>{badges[song.etapa]}</Left>
      )}
      <Body>
        <TouchableOpacity
          onPress={() => {
            if (props.onPress) {
              props.onPress(song);
            }
          }}>
          <Highlighter
            style={textStyles}
            highlightStyle={{
              backgroundColor: 'yellow'
            }}
            searchWords={[highlight]}
            textToHighlight={song.titulo}
          />
          <Highlighter
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
        {patchableSection}
      </Body>
      {openHighlightedRest}
      {chooseFileForLocale}
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
