import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Right, Body, Text, Badge } from 'native-base';
import { FlatList } from 'react-native';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';

import { SET_SALMOS_FILTER } from '../actions';

const SalmosScreen = props => {
  return (
    <BaseScreen {...props} searchHandler={props.filtrarHandler}>
      <FlatList
        data={props.items}
        keyExtractor={item => item.path}
        renderItem={({ item }) => (
          <ListItem avatar>
            <Left>
              <Badge
                style={{ backgroundColor: item.categoria.style.background }}>
                <Text style={{ color: item.categoria.style.color }}>
                  {item.categoria.letra}
                </Text>
              </Badge>
            </Left>
            <Body
              onPress={() =>
                props.navigation.navigate('Salmo', { path: item.path })}>
              <Text>{item.titulo}</Text>
              <Text note>{item.fuente}</Text>
            </Body>
          </ListItem>
        )}
      />
    </BaseScreen>
  );
};

const mapStateToProps = state => {
  var salmos = state.ui.get('salmos');
  var categoria = state.ui.get('salmos_categoria');
  var items = [];
  if (salmos) {
    if (categoria) {
      items = salmos.categorias[categoria];
    } else {
      items = salmos.alfabetico;
    }
  }
  var filter = state.ui.get('salmos_filter');
  if (filter) {
    items = items.filter(s => {
      return s.nombre.includes(filter);
    });
  }
  return {
    items: items,
    title: categoria ? categoria : 'Alfabético'
  };
};

const mapDispatchToProps = dispatch => {
  var filtrar = text => {
    console.log('Filtar', text);
    dispatch({ type: SET_SALMOS_FILTER, filter: text });
  };

  return {
    filtrarHandler: _.debounce(filtrar, 600)
  };
};

SalmosScreen.navigationOptions = {
  title: 'Salmos'
};

export default connect(mapStateToProps, mapDispatchToProps)(SalmosScreen);
