import React from 'react';
import { connect } from 'react-redux';
import { Dimensions, Platform, StyleSheet, ScrollView } from 'react-native';
import { Container, Content, Text, Icon } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import KeepAwake from 'react-native-keep-awake';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';
import colors from '../colors';
import color from 'color';
import {
  esLineaDeNotas,
  calcularTransporte,
  transportarNotas,
  notas
} from '../util';
import { salmoTransport } from '../actions';
import AppNavigatorConfig from '../AppNavigatorConfig';
import commonTheme from '../../native-base-theme/variables/platform';

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
    fontSize: fontSizeNotas,
    marginLeft: 4
  },
  lineaTituloNotaEspecial: {
    fontFamily: mono,
    color: 'red',
    fontSize: fontSizeTitulo - 2
  },
  lineaNotaEspecial: {
    fontFamily: mono,
    fontSize: fontSizeNotas,
    color: '#222'
  },
  lineaNotasConMargen: {
    fontFamily: mono,
    color: 'red',
    fontSize: fontSizeNotas,
    marginTop: 15,
    marginLeft: 4
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
/* eslint-disable no-unused-vars */
function preprocesarLinea(text) {
  var it = {};
  if (text.startsWith('S. A.')) {
    // Indicador de Salmista Y Asamblea
    var secondPoint = 4;
    it = {
      prefijo: text.substring(0, secondPoint + 1) + ' ',
      texto: text.substring(secondPoint + 1).trim(),
      style: styles.lineaNormal,
      prefijoStyle: styles.prefijo
    };
  } else if (
    text.startsWith('S.') ||
    text.startsWith('C.') ||
    text.startsWith('A.') ||
    text.startsWith('P.') ||
    text.startsWith('Niños.') ||
    text.startsWith('N.')
  ) {
    // Indicador de Salmista, Asamblea, Presbitero
    var pointIndex = text.indexOf('.');
    it = {
      prefijo: text.substring(0, pointIndex + 1) + ' ',
      texto: text.substring(pointIndex + 1).trim(),
      style: styles.lineaNormal,
      prefijoStyle: styles.prefijo
    };
    // Si tiene indicador de Nota?
    if (it.texto.endsWith('\u2217')) {
      it.texto = it.texto.replace('\u2217', '');
      it.sufijo = '\u2217';
      it.sufijoStyle = styles.lineaNotas;
    }
  } else if (esLineaDeNotas(text)) {
    it = {
      prefijo: '',
      texto: text.replace(/ {2}/g, ' ').trimRight(),
      style: styles.lineaNotas,
      notas: true
    };
  } else if (text.startsWith('\u2217')) {
    // Nota especial
    it = {
      prefijo: '\u2217  ',
      texto: text.substring(1).trim(),
      style: styles.lineaNotaEspecial,
      prefijoStyle: styles.lineaNotas
    };
  } else if (text.trim().startsWith('**') && text.trim().endsWith('**')) {
    // Titulo especial
    it = {
      prefijo: '',
      texto: text.replace(/\*/g, ''),
      style: styles.lineaTituloNotaEspecial
    };
  } else if (text.startsWith('-')) {
    // Texto especial
    it = {
      prefijo: '',
      texto: text.replace('-', ''),
      style: styles.lineaNotaEspecial
    };
  } else {
    it = {
      prefijo: '',
      texto: text.trimRight(),
      style: styles.lineaNormal,
      canto: true
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
    var lines = this.props.lines;
    var diferencia = 0;
    if (this.props.transportToNote) {
      diferencia = calcularTransporte(lines[0], this.props.transportToNote);
    }
    var firstPass = lines.map(l => {
      var it = preprocesarLinea(l);
      if (it.notas && diferencia !== 0) {
        it.texto = transportarNotas(it.texto, diferencia);
      }
      return it;
    });
    var secondPass = firstPass.map((it, i) => {
      // Ajustar margen izquierdo por prefijos
      if (it.prefijo == '' && i > 0) {
        var prevIt = firstPass[i - 1];
        if (prevIt.prefijo !== '') {
          it.prefijo = ' '.repeat(prevIt.prefijo.length);
        }
      } else if (it.prefijo == '' && i < firstPass.length - 1) {
        var nextIt = firstPass[i + 1];
        if (nextIt.prefijo !== '') {
          it.prefijo = ' '.repeat(nextIt.prefijo.length);
        }
      }
      // Ajustar estilo para las notas
      if (it.texto.trim() == '' && i < firstPass.length - 1) {
        var nextItm = firstPass[i + 1];
        if (nextItm.canto) {
          it.style = styles.lineaNotas;
        }
      }
      // Ajustar estilo para las notas si es la primer linea
      if (it.notas && i < firstPass.length - 1) {
        var nextItmn = firstPass[i + 1];
        if (nextItmn.prefijo !== '') {
          it.style = styles.lineaNotasConMargen;
        }
      }
      return it;
    });
    var items = secondPass.map((it, i) => {
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
  var transportToNote = state.ui.get('salmos_transport_note');
  return {
    salmo: salmo,
    lines: salmo.lines || [],
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
            color: AppNavigatorConfig.navigationOptions.headerTitleStyle.color
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

const ConnectedMenu = connect(mapStateToProps, mapDispatchToProps)(
  TransportNotesMenu
);

SalmoDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.salmo.titulo
    : 'Salmo',
  headerRight: <ConnectedMenu {...props} />
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoDetail);
