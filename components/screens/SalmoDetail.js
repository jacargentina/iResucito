// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Dimensions, ScrollView, View } from 'react-native';
import {
  Container,
  Content,
  Text,
  Icon,
  ActionSheet,
  Badge
} from 'native-base';
import KeepAwake from 'react-native-keep-awake';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';
import colors from '../colors';
import color from 'color';
import { notas } from '../../SongsProcessor';
import { NativeStyles } from '../util';
import { salmoTransport, generatePDF } from '../actions';
import {
  getSalmoFromProps,
  getSalmoTransported,
  getTransportToNote
} from '../selectors';
import AppNavigatorOptions from '../AppNavigatorOptions';
import commonTheme from '../../native-base-theme/variables/platform';
import I18n from '../translations';

class SalmoDetail extends React.Component<any> {
  static navigationOptions = (props: any) => ({
    title: props.navigation.state.params
      ? props.navigation.state.params.salmo.titulo
      : 'Salmo',
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <ConnectedViewPdf {...props} />
        <ConnectedTransportNotes {...props} />
      </View>
    )
  });

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.keepAwake) {
      KeepAwake.activate();
    }
  }

  componentWillUnmount() {
    if (this.props.keepAwake) {
      KeepAwake.deactivate();
      // Quitar cualquier transporte aplicado
      this.props.transportNote();
    }
  }

  render() {
    if (this.props.salmo.error) {
      var render_items = <Text>{this.props.salmo.error}</Text>;
    } else {
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
    }
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
              <Text style={NativeStyles.titulo}>{this.props.salmo.titulo}</Text>
              <Text style={NativeStyles.fuente}>{this.props.salmo.fuente}</Text>
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
  var lines = itemsToRender.map(it => {
    var c = Object.assign({}, it);
    if (c.notas === true) {
      c.texto = c.texto.replace(/ {2}/g, ' ');
    }
    return c;
  });
  return {
    salmo: salmo,
    lines: lines,
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
    viewPdf: (salmo, lines, navigation) => {
      dispatch(generatePDF(salmo, lines)).then(path => {
        navigation.navigate('PDFViewer', {
          uri: path,
          salmo: salmo
        });
      });
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
  var trigger =
    props.transportToNote === null || props.transportToNote === undefined ? (
      <Icon
        name="musical-note"
        style={{
          marginTop: 4,
          marginRight: 8,
          width: 32,
          fontSize: 30,
          textAlign: 'center',
          color: AppNavigatorOptions.headerTitleStyle.color
        }}
      />
    ) : (
      <Badge style={{ marginTop: 6, marginRight: 6 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            fontStyle: 'italic',
            textAlign: 'center',
            color: AppNavigatorOptions.headerTitleStyle.color
          }}>
          {props.transportToNote}
        </Text>
      </Badge>
    );
  return (
    <Menu onSelect={value => props.transportNote(value)}>
      <MenuTrigger>{trigger}</MenuTrigger>
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

const ViewPdf = props => {
  return (
    <Icon
      name="paper"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => props.viewPdf(props.salmo, props.lines, props.navigation)}
    />
  );
};

const ConnectedViewPdf = connect(mapStateToProps, mapDispatchToProps)(ViewPdf);

export default connect(mapStateToProps, mapDispatchToProps)(SalmoDetail);
