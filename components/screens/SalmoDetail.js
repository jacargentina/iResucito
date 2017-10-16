import React from 'react';
import { connect } from 'react-redux';
import {
  Dimensions,
  Platform,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { Container, Content, Text, Icon } from 'native-base';
import RNFS from 'react-native-fs';
import DeviceInfo from 'react-native-device-info';
import KeepAwake from 'react-native-keep-awake';
import { SET_SALMO_CONTENT, decideSalmoAddDialog } from '../actions';
import AppNavigatorConfig from '../AppNavigatorConfig';
import colors from '../colors';

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

export function esLineaDeNotas(text) {
  var linea = text
    .trim()
    .split(' ')
    .filter(i => i.length > 0);
  var contieneNota =
    linea.includes('Do') ||
    linea.includes('Do7') ||
    linea.includes('Do\u2013') ||
    linea.includes('Re') ||
    linea.includes('Re7') ||
    linea.includes('Re\u2013') ||
    linea.includes('Re-') ||
    linea.includes('Mi') ||
    linea.includes('Mi7') ||
    linea.includes('Mi\u2013') ||
    linea.includes('Fa') ||
    linea.includes('Fa7') ||
    linea.includes('Fa#') ||
    linea.includes('Fa#-') ||
    linea.includes('Sol') ||
    linea.includes('Sol7') ||
    linea.includes('Sol\u2013') ||
    linea.includes('La') ||
    linea.includes('La7') ||
    linea.includes('La\u2013') ||
    linea.includes('La-') ||
    linea.includes('Si') ||
    linea.includes('Si7') ||
    linea.includes('Si\u2013');
  return contieneNota;
}

function preprocesarLinea(text, nextText) {
  var it = {};
  if (text.startsWith('S.')) {
    // Indicador de Salmista
    it = {
      prefijo: 'S. ',
      texto: text.substring(2).trim(),
      style: styles.lineaNormal,
      prefijoStyle: styles.prefijo
    };
  } else if (text.startsWith('A.')) {
    // Indicador de Asamblea
    it = {
      prefijo: 'A. ',
      texto: text.substring(2).trim(),
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
    this.props.load(this.props.salmo);
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
  var salmo_lines = state.ui.get('salmo_lines');
  var keepAwake = state.ui.getIn(['settings', 'keepAwake']);
  return {
    salmo: salmo,
    lines: salmo_lines || [],
    background: colors[salmo.etapa],
    keepAwake: keepAwake
  };
};

const loadSalmo = salmo => {
  return dispatch => {
    var promise =
      Platform.OS == 'ios'
        ? RNFS.readFile(salmo.path)
        : RNFS.readFileAssets(salmo.path);
    promise
      .then(content => {
        dispatch({ type: SET_SALMO_CONTENT, content });
      })
      .catch(err => {
        Alert.alert('Error', err.message);
      });
  };
};

const mapDispatchToProps = dispatch => {
  return {
    load: salmo => dispatch(loadSalmo(salmo)),
    showSalmosAdd: salmo => {
      dispatch(decideSalmoAddDialog(salmo));
    }
  };
};

const AddToList = props => {
  return (
    <Icon
      name="add"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 40,
        textAlign: 'center',
        color: AppNavigatorConfig.navigationOptions.headerTitleStyle.color
      }}
      onPress={() => props.showSalmosAdd(props.salmo)}
    />
  );
};

const AddToListButton = connect(mapStateToProps, mapDispatchToProps)(AddToList);

SalmoDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.salmo.titulo
    : 'Salmo',
  headerRight: <AddToListButton {...props} />
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoDetail);
