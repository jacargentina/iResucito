import React from 'react';
import { connect } from 'react-redux';
import { Text, Button, H3, Icon } from 'native-base';
import { View } from 'react-native';

const LiturgiaChooser = props => {
  var titulo = '';
  switch (props.listKey) {
    case 'ambiental':
      titulo = 'Monición Ambiental';
      break;
    case 'entrada':
      titulo = 'Canto de Entrada';
      break;
    case 'paz':
      titulo = 'Paz y Ofrendas';
      break;
    case 'comunion':
      titulo = 'Comunión';
      break;
    case 'salida':
      titulo = 'Canto de Salida';
      break;
    case '1-monicion':
      titulo = 'Monición 1er Palabra';
      break;
    case '1':
      titulo = '1er Palabra';
      break;
    case '1-salmo':
      titulo = 'Rta. 1er Palabra';
      break;
    case '2-monicion':
      titulo = 'Monición 2da Palabra';
      break;
    case '2':
      titulo = '2da Palabra';
      break;
    case '2-salmo':
      titulo = 'Rta. 2da Palabra';
      break;
    case '3-monicion':
      titulo = 'Monición 3ra Palabra';
      break;
    case '3':
      titulo = '3ra Palabra';
      break;
    case '3-salmo':
      titulo = 'Rta. 3ra Palabra';
      break;
    case 'evangelio-monicion':
      titulo = 'Monición Evangelio';
      break;
    case 'evangelio':
      titulo = 'Evangelio';
      break;
  }
  var item = null;
  if (
    props.listKey == '1' ||
    props.listKey == '2' ||
    props.listKey == '3' ||
    props.listKey == 'evangelio'
  ) {
    var cita = props.listMap.get(props.listKey);
    var textoCita = !cita ? 'Cita...' : cita;
    item = (
      <View
        style={{
          flexDirection: 'row'
        }}>
        <Button transparent iconLeft primary>
          <Icon name="add" />
          <Text>{textoCita}</Text>
        </Button>
      </View>
    );
  } else if (
    props.listKey.includes('monicion') ||
    props.listKey.includes('ambiental')
  ) {
    var nombre = props.listMap.get(props.listKey);
    var textoMonicion = !nombre ? 'Elegir hermano...' : nombre;
    item = (
      <View
        style={{
          flexDirection: 'row'
        }}>
        <Button transparent iconLeft primary>
          <Icon name="add" />
          <Text>{textoMonicion}</Text>
        </Button>
      </View>
    );
  } else {
    var salmo = props.listMap.get(props.listKey);
    var textoSalmo = !salmo ? 'Elegir salmo...' : salmo.titulo;
    item = (
      <View
        style={{
          flexDirection: 'row'
        }}>
        <Button transparent iconLeft primary>
          <Icon name="add" />
          <Text>{textoSalmo}</Text>
        </Button>
      </View>
    );
  }
  return (
    <View style={{ marginTop: 15, marginBottom: 15, alignItems: 'center' }}>
      <H3 style={{ marginBottom: 15 }}>{titulo}</H3>
      {item}
    </View>
  );
};

const mapStateToProps = (state, props) => {
  return {
    listMap: props.listMap,
    listKey: props.listKey
  };
};

const mapDispatchToProps = () => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(LiturgiaChooser);
