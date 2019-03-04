// @flow
import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { ListItem, Left, Right, Body, Text, Badge, Icon } from 'native-base';
import Highlighter from 'react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import badges from '../badges';
import commonTheme from '../../native-base-theme/variables/platform';
import textTheme from '../../native-base-theme/components/Text';
import I18n from '../translations';
import { DataContext } from '../../DataContext';

const textStyles = textTheme(commonTheme);
const noteStyles = textStyles['.note'];
delete textStyles['.note'];

const SalmoListItem = (props: any) => {
  const data = useContext(DataContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { keys, getLocaleReal } = data.settings;
  const { showSalmoDialog } = data.salmoChooserDialog;
  const { setSongLocalePatch } = data.songsMeta;

  var devMode = props.devModeDisabled === true ? false : keys.developerMode;
  var developerMode = devMode;
  var locale = getLocaleReal();

  if (props.showBadge) {
    var badgeWrapper = (
      <Left style={{ marginLeft: -8 }}>{badges[props.salmo.etapa]}</Left>
    );
  }
  if (
    props.highlight &&
    !props.salmo.error &&
    props.salmo.fullText.toLowerCase().includes(props.highlight.toLowerCase())
  ) {
    var linesToHighlight = props.salmo.lines.filter(l =>
      l.toLowerCase().includes(props.highlight.toLowerCase())
    );
    var children = linesToHighlight.map((l, i) => {
      return (
        <Highlighter
          key={i}
          highlightStyle={{
            backgroundColor: 'yellow'
          }}
          searchWords={[props.highlight]}
          textToHighlight={l}
        />
      );
    });
    var firstHighlighted = children.shift();
    if (children.length > 1) {
      var highlightedRest = (
        <Collapsible collapsed={isCollapsed}>{children}</Collapsible>
      );
      var openHighlightedRest = (
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
  if (props.salmo.error) {
    var loadingError = (
      <Right>
        <Icon
          name="bug"
          style={{
            fontSize: 32,
            color: commonTheme.brandPrimary
          }}
          onPress={() => {
            Alert.alert('Error', props.salmo.error);
          }}
        />
      </Right>
    );
  } else if (developerMode && props.salmo.patchable && !openHighlightedRest) {
    if (props.salmo.patched) {
      var patchableSection = (
        <TouchableOpacity
          onPress={() => setSongLocalePatch(props.salmo, locale, undefined)}
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
            {props.salmo.patchedTitle}
          </Text>
        </TouchableOpacity>
      );
    } else {
      var chooseFileForLocale = (
        <Right>
          <Icon
            name="link"
            style={{
              fontSize: 32,
              color: commonTheme.brandPrimary
            }}
            onPress={() => showSalmoDialog(props.salmo)}
          />
        </Right>
      );
    }
  } else if (props.salmo.patchable && !props.developerMode) {
    var patchableSection = (
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
  return (
    <ListItem avatar={props.showBadge} style={{ paddingHorizontal: 5 }}>
      {badgeWrapper}
      <Body>
        <TouchableOpacity
          onPress={() => {
            if (props.onPress) {
              props.onPress(props.salmo);
            }
          }}>
          <Highlighter
            style={textStyles}
            highlightStyle={{
              backgroundColor: 'yellow'
            }}
            searchWords={[props.highlight]}
            textToHighlight={props.salmo.titulo}
          />
          <Highlighter
            style={noteStyles}
            highlightStyle={{
              backgroundColor: 'yellow'
            }}
            searchWords={[props.highlight]}
            textToHighlight={props.salmo.fuente}
          />
          {firstHighlighted}
          {highlightedRest}
        </TouchableOpacity>
        {patchableSection}
      </Body>
      {openHighlightedRest}
      {chooseFileForLocale}
      {loadingError}
    </ListItem>
  );
};

export default SalmoListItem;
