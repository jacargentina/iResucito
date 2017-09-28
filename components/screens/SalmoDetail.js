import React from 'react';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView } from 'react-native';
import { Container, Content, Text } from 'native-base';
import RNFS from 'react-native-fs';
import BaseScreen from './BaseScreen';
import { SET_SALMO_CONTENT } from '../actions';

var styles = StyleSheet.create({
  titulo: {
    fontFamily: Platform.OS == 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5
  },
  fuente: {
    fontFamily: Platform.OS == 'ios' ? 'Courier' : 'monospace',
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 25
  },
  lineaNotas: {
    fontFamily: Platform.OS == 'ios' ? 'Courier' : 'monospace',
    color: 'red',
    fontSize: 12
  },
  lineaNormal: {
    fontFamily: Platform.OS == 'ios' ? 'Courier' : 'monospace',
    color: 'black',
    fontSize: 15
  }
});

export function esLineaDeNotas(text) {
  var linea = text
    .trim()
    .split(' ')
    .filter(i => i.length > 0);
  var contieneNota =
    linea.includes('Do') ||
    linea.includes('Do\u2013') ||
    linea.includes('Re') ||
    linea.includes('Re\u2013') ||
    linea.includes('Re-') ||
    linea.includes('Mi') ||
    linea.includes('Mi\u2013') ||
    linea.includes('Fa') ||
    linea.includes('Fa#') ||
    linea.includes('Sol') ||
    linea.includes('Sol7') ||
    linea.includes('Sol\u2013') ||
    linea.includes('La') ||
    linea.includes('La\u2013') ||
    linea.includes('La-') ||
    linea.includes('La7') ||
    linea.includes('Si') ||
    linea.includes('Si\u2013');
  return contieneNota;
}

function preprocesarLinea(text) {
  var linea = text.trim();
  if (linea.startsWith('S.')) {
    // Indicador de Salmista
    return {
      prefijo: 'S.',
      texto: linea.substring(2),
      style: styles.lineaNormal
    };
  }
  if (linea.startsWith('A.')) {
    // Indicador de Asamblea
    return {
      prefijo: 'A.',
      texto: linea.substring(2),
      style: styles.lineaNormal
    };
  }
  if (esLineaDeNotas(linea)) {
    var text = text.replace(/  /g, ' ');
    return { prefijo: '   ', texto: text, style: styles.lineaNotas };
  }
  return { prefijo: '   ', texto: text, style: styles.lineaNormal };
}

class SalmoDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.load(this.props.salmo);
  }

  render() {
    var items = this.props.lines.map((l, i) => {
      var it = preprocesarLinea(l);
      return (
        <Text numberOfLines={1} key={i + 'texto'} style={it.style}>
          <Text key={i + 'prefijo'} style={it.style}>
            {it.prefijo}
          </Text>
          {it.texto}
        </Text>
      );
    });
    return (
      <Container>
        <ScrollView horizontal style={{ marginLeft: 10 }}>
          <ScrollView>
            <Content padder>
              <Text style={styles.titulo}>{this.props.salmo.titulo}</Text>
              <Text style={styles.fuente}>{this.props.salmo.fuente}</Text>
            </Content>
            {items}
          </ScrollView>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  var salmo = state.ui.get('salmo_detail');
  var salmo_lines = state.ui.get('salmo_lines');
  return {
    salmo: salmo,
    lines: salmo_lines || []
  };
};

const loadSalmo = salmo => {
  return (dispatch, getState) => {
    RNFS.readFile(salmo.path).then(content => {
      dispatch({ type: SET_SALMO_CONTENT, content });
    });
  };
};

const mapDispatchToProps = dispatch => {
  return {
    load: salmo => dispatch(loadSalmo(salmo))
  };
};

SalmoDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.salmo.titulo
    : 'Salmo'
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoDetail);
