// @flow
import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, Alert } from 'react-native';
import { ListItem, Left, Right, Body, Text, Badge, Icon } from 'native-base';
import Highlighter from 'react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import badges from '../badges';
import commonTheme from '../../native-base-theme/variables/platform';
import textTheme from '../../native-base-theme/components/Text';
import I18n from '../translations';

import { showChooseLocaleDialog, setSongLocalePatch } from '../actions';
import { getLocaleReal } from '../selectors';

type State = {
  isCollapsed: boolean
};

class SalmoListItem extends React.Component<any, State> {
  textStyles: any;
  noteStyles: any;

  constructor(props: any) {
    super(props);
    this.state = {
      isCollapsed: true
    };
    this.textStyles = textTheme(commonTheme);
    this.noteStyles = this.textStyles['.note'];
    delete this.textStyles['.note'];
  }

  render() {
    if (this.props.showBadge) {
      var badgeWrapper = (
        <Left style={{ marginLeft: -8 }}>{badges[this.props.salmo.etapa]}</Left>
      );
    }
    if (
      this.props.highlight &&
      !this.props.salmo.error &&
      this.props.salmo.fullText
        .toLowerCase()
        .includes(this.props.highlight.toLowerCase())
    ) {
      var linesToHighlight = this.props.salmo.lines.filter(l =>
        l.toLowerCase().includes(this.props.highlight.toLowerCase())
      );
      var children = linesToHighlight.map((l, i) => {
        return (
          <Highlighter
            key={i}
            highlightStyle={{
              backgroundColor: 'yellow'
            }}
            searchWords={[this.props.highlight]}
            textToHighlight={l}
          />
        );
      });
      var firstHighlighted = children.shift();
      if (children.length > 1) {
        var highlightedRest = (
          <Collapsible collapsed={this.state.isCollapsed}>
            {children}
          </Collapsible>
        );
        var openHighlightedRest = (
          <Right>
            <TouchableOpacity
              onPress={() => {
                this.setState({ isCollapsed: !this.state.isCollapsed });
              }}>
              <Badge warning>
                <Text>{children.length}+</Text>
              </Badge>
            </TouchableOpacity>
          </Right>
        );
      }
    }
    if (this.props.salmo.error) {
      var loadingError = (
        <Right>
          <Icon
            name="bug"
            style={{
              fontSize: 32,
              color: commonTheme.brandPrimary
            }}
            onPress={() => {
              Alert.alert('Error', this.props.salmo.error);
            }}
          />
        </Right>
      );
    } else if (
      this.props.developerMode &&
      this.props.salmo.patchable &&
      !openHighlightedRest
    ) {
      if (this.props.salmo.patched) {
        var patchableSection = (
          <TouchableOpacity
            onPress={() =>
              this.props.unsetFileForLocale(this.props.salmo, this.props.locale)
            }
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
            <Text style={{ ...this.noteStyles, marginRight: 5, marginTop: 5 }}>
              {this.props.salmo.patchedTitle}
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
              onPress={() => this.props.chooseFileForLocale(this.props.salmo)}
            />
          </Right>
        );
      }
    } else if (this.props.salmo.patchable && !this.props.developerMode) {
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
          <Text style={{ ...this.noteStyles, marginRight: 5, marginTop: 5 }}>
            {I18n.t('ui.locale warning title')}
          </Text>
        </TouchableOpacity>
      );
    }
    return (
      <ListItem avatar={this.props.showBadge} style={{ paddingHorizontal: 5 }}>
        {badgeWrapper}
        <Body>
          <TouchableOpacity
            onPress={() => {
              if (this.props.onPress) {
                this.props.onPress(this.props.salmo);
              }
            }}>
            <Highlighter
              style={this.textStyles}
              highlightStyle={{
                backgroundColor: 'yellow'
              }}
              searchWords={[this.props.highlight]}
              textToHighlight={this.props.salmo.titulo}
            />
            <Highlighter
              style={this.noteStyles}
              highlightStyle={{
                backgroundColor: 'yellow'
              }}
              searchWords={[this.props.highlight]}
              textToHighlight={this.props.salmo.fuente}
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
  }
}

const mapStateToProps = (state, props) => {
  var devMode =
    props.devModeDisabled === true
      ? false
      : state.ui.getIn(['settings', 'developerMode']);
  return {
    developerMode: devMode,
    locale: getLocaleReal(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chooseFileForLocale: salmo => {
      dispatch(showChooseLocaleDialog(salmo));
    },
    unsetFileForLocale: (salmo, locale) => {
      dispatch(setSongLocalePatch(salmo, locale, undefined));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SalmoListItem);
