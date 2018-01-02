import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { ListItem, Left, Right, Body, Text, Badge, Icon } from 'native-base';
import Highlighter from 'react-native-highlight-words';
import Collapsible from 'react-native-collapsible';
import badges from '../badges';
import commonTheme from '../../native-base-theme/variables/platform';
import textTheme from '../../native-base-theme/components/Text';
import I18n from '../../i18n';

class SalmoListItem extends React.Component {
  constructor(props) {
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
      this.props.resaltar &&
      this.props.salmo.fullText
        .toLowerCase()
        .includes(this.props.resaltar.toLowerCase())
    ) {
      var lineasParaResaltar = this.props.salmo.lines.filter(l =>
        l.toLowerCase().includes(this.props.resaltar.toLowerCase())
      );
      var children = lineasParaResaltar.map((l, i) => {
        return (
          <Highlighter
            key={i}
            highlightStyle={{
              backgroundColor: 'yellow'
            }}
            searchWords={[this.props.resaltar]}
            textToHighlight={l}
          />
        );
      });
      var primerResaltado = children.shift();
      if (children.length > 1) {
        var restoResaltado = (
          <Collapsible collapsed={this.state.isCollapsed}>
            {children}
          </Collapsible>
        );
        var abrirRestoResaltado = (
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
    if (this.props.salmo.locale === false && !abrirRestoResaltado) {
      var advertenciaSinLocale = (
        <Right>
          <Icon
            name="warning"
            style={{
              fontSize: 32,
              color: commonTheme.brandPrimary
            }}
            onPress={() => {
              Alert.alert(
                I18n.t('ui.locale warning title'),
                I18n.t('ui.locale warning message')
              );
            }}
          />
        </Right>
      );
    }
    return (
      <ListItem avatar={this.props.showBadge} style={{ paddingHorizontal: 5 }}>
        {badgeWrapper}
        <Body>
          <TouchableOpacity
            onPress={() => {
              this.props.onPress(this.props.salmo);
            }}>
            <Highlighter
              style={this.textStyles}
              highlightStyle={{
                backgroundColor: 'yellow'
              }}
              searchWords={[this.props.resaltar]}
              textToHighlight={this.props.salmo.titulo}
            />
            <Highlighter
              style={this.noteStyles}
              highlightStyle={{
                backgroundColor: 'yellow'
              }}
              searchWords={[this.props.resaltar]}
              textToHighlight={this.props.salmo.fuente}
            />
            {primerResaltado}
            {restoResaltado}
          </TouchableOpacity>
        </Body>
        {abrirRestoResaltado}
        {advertenciaSinLocale}
      </ListItem>
    );
  }
}

export default SalmoListItem;
