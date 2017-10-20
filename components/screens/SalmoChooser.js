import React from 'react';
import { connect } from 'react-redux';
import { Text, Button, H3 } from 'native-base';
import { View } from 'react-native';

const SalmoChooser = props => {
  var listType = props.listMap.get('type');
  var titulo = '';
  switch (props.listKey) {
    case 'entrada':
      titulo = 'Canto de Entrada';
      break;
    case 'paz':
      titulo = 'Abrazo de la Paz';
      break;
    case 'comunion':
      titulo = 'Comunión';
      break;
    case 'salida':
      titulo = 'Canto de Salida';
      break;
    case '1':
      titulo = '1. Palabra';
      break;
    case '2':
      titulo = '2. Palabra';
      break;
    case '3':
      titulo = listType == 'eucaristia' ? 'Evangelio' : '3. Palabra';
      break;
    case '4':
      titulo = 'Evangelio';
      break;
  }
  var salmo = props.listMap.get(props.listKey);
  var textoBoton = !salmo ? 'Sin seleccionar' : salmo.titulo;
  return (
    <View style={{ flex: 1, padding: 5, alignItems: 'center' }}>
      <H3 style={{ marginBottom: 15 }}>{titulo}</H3>
      <Button style={{ alignSelf: 'center' }} small bordered>
        <Text>{textoBoton}</Text>
      </Button>
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
