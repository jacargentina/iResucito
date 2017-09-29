import React from 'react';
import { connect } from 'react-redux';
import { Platform, StyleSheet, ScrollView } from 'react-native';
import { Container, Content, Text } from 'native-base';
import RNFS from 'react-native-fs';
import BaseScreen from './BaseScreen';
import { SET_SALMO_CONTENT } from '../actions';

var mono = Platform.OS == 'ios' ? 'Courier' : 'monospace';

var styles = StyleSheet.create({
  titulo: {
    fontFamily: mono,
    fontWeight: 'bold',
    color: 'red',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8
  },
  fuente: {
    fontFamily: mono,
    color: 'gray',
    fontSize: 14,
    textAlign: 'center'
  },
  lineaNotas: {
    fontFamily: mono,
    color: 'red',
    fontSize: 11
  },
  lineaNotasConMargen: {
    fontFamily: mono,
    color: 'red',
    fontSize: 11,
    marginTop: 20
  },
  lineaNormal: {
    fontFamily: mono,
    color: 'black',
    fontSize: 14,
    marginBottom: 14
  },
  prefijo: {
    fontFamily: mono,
    color: 'gray',
    fontSize: 14
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
  var linea = text.trim();
  if (linea.startsWith('S.')) {
    // Indicador de Salmista
    var it = {
      prefijo: 'S. ',
      texto: linea.substring(2).trim(),
      style: styles.lineaNormal,
      prefijoStyle: styles.prefijo
    };
  } else if (linea.startsWith('A.')) {
    // Indicador de Asamblea
    var it = {
      prefijo: 'A. ',
      texto: linea.substring(2).trim(),
      style: styles.lineaNormal,
      prefijoStyle: styles.prefijo
    };
  } else if (esLineaDeNotas(linea)) {
    var it = {
      prefijo: '    ',
      texto: linea.replace(/  /g, ' ').trimRight(),
      style: styles.lineaNotas
    };
    if (nextText) {
      var next_it = preprocesarLinea(nextText);
      if (next_it.prefijo.trim() !== '') {
        it.style = styles.lineaNotasConMargen;
      }
    }
  } else {
    var it = {
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
    this.props.load(this.props.salmo);
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
    return (
      <Container style={{ backgroundColor: this.props.background }}>
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
    lines: salmo_lines || [],
    background: state.ui.get('colors')[salmo.categoria]
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
