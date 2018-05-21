import React from 'react';
import { connect } from 'react-redux';
import { Dimensions, ScrollView, View } from 'react-native';
import { Container, Content, Text, Icon, ActionSheet } from 'native-base';
import KeepAwake from 'react-native-keep-awake';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';
import colors from '../colors';
import color from 'color';
import { notas, styles } from '../util';
import { salmoTransport, generatePDF, sharePDF } from '../actions';
import {
  getSalmoFromProps,
  getSalmoTransported,
  getTransportToNote
} from '../selectors';
import AppNavigatorConfig from '../AppNavigatorConfig';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';

class SalmoDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (this.props.keepAwake) {
      KeepAwake.activate();
    }
  }

  componentWillUnmount() {
    if (this.props.keepAwake) {
      KeepAwake.deactivate();
    }
  }

  render() {
    var render_items = this.props.lines.map((it, i) => {
      if (it.sufijo) {
        var sufijo = (
          <Text key={i + 'sufijo'} style={it.sufijoStyle}>
            {it.sufijo}
          </Text>
        );
      }
      return (
        <Text numberOfLines={1} key={i + 'texto'} style={it.style}>
          <Text key={i + 'prefijo'} style={it.prefijoStyle || it.style}>
            {it.prefijo}
          </Text>
          {it.texto}
          {sufijo}
        </Text>
      );
    });
    render_items.push(<Text key="spacer">{'\n\n\n'}</Text>);
    var margin = 10;
    var minWidth = Dimensions.get('window').width - margin * 2;
    return (
      <Container style={{ backgroundColor: this.props.background }}>
        <ScrollView
          horizontal
          style={{
            marginLeft: margin,
            marginRight: margin
          }}>
          <ScrollView>
            <Content
              style={{
                minWidth: minWidth
              }}>
              <Text style={styles.titulo}>
                {this.props.salmo.titulo}{' '}
                <Text style={styles.fuente}>{this.props.salmo.fuente}</Text>
              </Text>
              {render_items}
            </Content>
          </ScrollView>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  var salmo = getSalmoFromProps(state, props);
  var keepAwake = state.ui.getIn(['settings', 'keepAwake']);
  var backColor = color(colors[salmo.etapa]);
  var colorStr = backColor.lighten(0.1).string();
  var transportToNote = getTransportToNote(state);
  var itemsToRender = getSalmoTransported(state, props);
  // Ajuste final para renderizado en screen
  itemsToRender.forEach(it => {
    if (it.notas === true) {
      it.texto = it.texto.replace(/ {2}/g, ' ');
    }
  });
  return {
    salmo: salmo,
    lines: itemsToRender,
    background: colorStr,
    keepAwake: keepAwake,
    transportToNote: transportToNote
  };
};

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => {
  return {
    transportNote: transportTo => {
      dispatch(salmoTransport(transportTo));
    },
    shareSong: (salmo, lines, navigation) => {
      ActionSheet.show(
        {
          options: [
            I18n.t('share_action.view pdf'),
            I18n.t('share_action.share pdf'),
            I18n.t('ui.cancel')
          ],
          cancelButtonIndex: 2,
          title: I18n.t('ui.share')
        },
        index => {
          index = Number(index);
          if (index !== 2) {
            dispatch(generatePDF(salmo, lines)).then(path => {
              if (index === 0) {
                navigation.navigate('PDFViewer', {
                  uri: path,
                  title: salmo.titulo
                });
              } else {
                dispatch(sharePDF(salmo, path));
              }
            });
          }
        }
      );
    }
  };
};

const TransportNotesMenu = props => {
  var menuOptionItems = notas.map((nota, i) => {
    if (props.transportToNote === nota)
      var customStyles = {
        optionWrapper: {
          backgroundColor: commonTheme.brandPrimary,
          paddingHorizontal: 10,
          paddingVertical: 10
        },
        optionText: {
          color: 'white'
        }
      };
    return (
      <MenuOption
        key={i}
        value={nota}
        text={nota}
        customStyles={customStyles}
      />
    );
  });
  return (
    <Menu onSelect={value => props.transportNote(value)}>
      <MenuTrigger>
        <Icon
          name="musical-note"
          style={{
            marginTop: 4,
            marginRight: 8,
            width: 32,
            fontSize: 30,
            textAlign: 'center',
            color: AppNavigatorConfig.navigationOptions(props).headerTitleStyle.color
          }}
        />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionWrapper: { paddingHorizontal: 10, paddingVertical: 10 }
        }}>
        {props.transportToNote != null && (
          <MenuOption value={null} text="Original" />
        )}
        {menuOptionItems}
      </MenuOptions>
    </Menu>
  );
};

const ConnectedTransportNotes = connect(mapStateToProps, mapDispatchToProps)(
  TransportNotesMenu
);

const ShareSong = props => {
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: AppNavigatorConfig.navigationOptions(props).headerTitleStyle.color
      }}
      onPress={() =>
        props.shareSong(props.salmo, props.lines, props.navigation)
      }
    />
  );
};

const ConnectedShareSong = connect(mapStateToProps, mapDispatchToProps)(
  ShareSong
);

SalmoDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.salmo.titulo
    : 'Salmo',
  headerRight: (
    <View style={{ flexDirection: 'row' }}>
      <ConnectedShareSong {...props} />
      <ConnectedTransportNotes {...props} />
    </View>
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoDetail);
