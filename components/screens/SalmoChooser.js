import React from 'react';
import { connect } from 'react-redux';
import { Text, Button, H3, Icon } from 'native-base';
import { View } from 'react-native';

const SalmoChooser = props => {
  var listType = props.listMap.get('type');
  var titulo = '';
  switch (props.listKey) {
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
    case '1':
      titulo = 'Rta. 1er Palabra';
      break;
    case '2':
      titulo = 'Rta. 2da Palabra';
      break;
    case '3':
      titulo = listType == 'eucaristia' ? 'Evangelio' : 'Rta. 3er Palabra';
      break;
    case '4':
      titulo = 'Evangelio';
      break;
  }
  var salmo = props.listMap.get(props.listKey);
  var textoBoton = !salmo ? 'Elegir un salmo' : salmo.titulo;
  return (
    <View style={{ marginTop: 15, marginBottom: 15, alignItems: 'center' }}>
      <H3 style={{ marginBottom: 15 }}>{titulo}</H3>
      <View
        style={{
          flexDirection: 'row'
        }}>
        <Button iconLeft primary>
          <Icon name="add" />
          <Text>{textoBoton}</Text>
        </Button>
        <Button danger style={{ marginLeft: 10, width: 46 }}>
          <Icon name="trash" />
        </Button>
      </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(SalmoChooser);
