import React from 'react';
import { connect } from 'react-redux';
import { Dimensions, Platform, StyleSheet, ScrollView } from 'react-native';
import { Container, Content, Text } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import KeepAwake from 'react-native-keep-awake';
import colors from '../colors';
import color from 'color';
import { esLineaDeNotas } from '../util';

var mono = Platform.OS == 'ios' ? 'Menlo-Bold' : 'monospace';
var isTablet = DeviceInfo.isTablet();
var fontSizeTitulo = isTablet ? 25 : 22;
var fontSizeTexto = isTablet ? 17 : 14;
var fontSizeNotas = isTablet ? 15.2 : 12.2;

var styles = StyleSheet.create({
  titulo: {
    fontFamily: mono,
    color: 'red',
    fontSize: fontSizeTitulo,
    marginTop: 8,
    marginBottom: 8
  },
  fuente: {
    fontFamily: mono,
    color: 'gray'
  },
  lineaNotas: {
    fontFamily: mono,
    color: 'red',
    fontSize: fontSizeNotas
  },
  lineaNotaEspecial: {
    fontFamily: mono,
    color: 'gray',
    fontSize: fontSizeNotas
  },
  lineaNotasConMargen: {
    fontFamily: mono,
    color: 'red',
    fontSize: fontSizeNotas,
    marginTop: 15
  },
  lineaNormal: {
    fontFamily: mono,
    color: 'black',
    fontSize: fontSizeTexto,
    marginBottom: 8
  },
  prefijo: {
    fontFamily: mono,
    color: 'gray',
    fontSize: fontSizeTexto
  }
});

function preprocesarLinea(text, nextText) {
  var it = {};
  if (
    text.startsWith('S.') ||
    text.startsWith('A.') ||
    text.startsWith('P.') ||
    text.startsWith('Niños.')
  ) {
    // Indicador de Salmista, Asamblea, Presbitero
    var pointIndex = text.indexOf('.');
    it = {
      prefijo: text.substring(0, pointIndex + 1) + ' ',
      texto: text.substring(pointIndex + 1).trim(),
      style: styles.lineaNormal,
      prefijoStyle: styles.prefijo
    };
  } else if (esLineaDeNotas(text)) {
    it = {
      prefijo: '   ',
      texto: text.replace(/ {2}/g, ' ').trimRight(),
      style: styles.lineaNotas
    };
    if (nextText) {
      var next_it = preprocesarLinea(nextText);
      if (next_it.prefijo.trim() !== '') {
        it.style = styles.lineaNotasConMargen;
      }
    }
  } else if (text.startsWith('\u2217')) {
    // Nota especial
    it = {
      prefijo: '\u2217  ',
      texto: text.substring(1).trim(),
      style: styles.lineaNotaEspecial,
      prefijoStyle: styles.lineaNotas
    };
  } else {
    it = {
      prefijo: '   ',
      texto: text.trimRight(),
      style: styles.lineaNormal
    };
  }
  return it;
}

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
    var items = this.props.lines.map((l, i) => {
      var it = preprocesarLinea(l, this.props.lines[i + 1]);
      return (
        <Text numberOfLines={1} key={i + 'texto'} style={it.style}>
          <Text key={i + 'prefijo'} style={it.prefijoStyle || it.style}>
            {it.prefijo}
          </Text>
          {it.texto}
        </Text>
      );
    });
    items.push(<Text key="spacer">{'\n\n\n'}</Text>);
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
              {items}
            </Content>
          </ScrollView>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => {
  var salmo = props.navigation.state.params.salmo;
  var keepAwake = state.ui.getIn(['settings', 'keepAwake']);
  var backColor = color(colors[salmo.etapa]);
  var colorStr = backColor.lighten(0.1).string();
  return {
    salmo: salmo,
    lines: salmo.lines || [],
    background: colorStr,
    keepAwake: keepAwake
  };
};

/* eslint-disable no-unused-vars */
const mapDispatchToProps = dispatch => {
  return {};
};

SalmoDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.salmo.titulo
    : 'Salmo'
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoDetail);
