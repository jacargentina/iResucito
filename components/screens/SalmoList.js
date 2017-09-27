import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Right, Body, Text, Badge } from 'native-base';
import { FlatList } from 'react-native';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';

import { SET_SALMOS_FILTER } from '../actions';

const SalmoList = props => {
  return (
    <BaseScreen {...props} searchHandler={props.filtrarHandler}>
      <FlatList
        data={props.items}
        keyExtractor={item => item.path}
        renderItem={({ item }) => {
          if (props.showBadge) {
            var badgeWrapper = <Left>{props.badges[item.categoria]}</Left>;
          }
          return (
            <ListItem
              avatar={props.showBadge}
              onPress={() => {
                props.navigation.navigate('Detail', { salmo: item });
              }}>
              {badgeWrapper}
              <Body>
                <Text>{item.titulo}</Text>
                <Text note>{item.fuente}</Text>
              </Body>
            </ListItem>
          );
        }}
      />
    </BaseScreen>
  );
};

const mapStateToProps = state => {
  var salmos = state.ui.get('salmos');
  var categoria = state.ui.get('salmos_categoria');
  var menu = state.ui.get('menu');
  var badges = state.ui.get('badges');
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
    showBadge: categoria == null,
    badges: badges
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

const CountText = props => {
  return (
    <Text style={{ marginRight: 8, fontSize: 10 }}>{props.items.length}</Text>
  );
};

const ConnectedCountText = connect(mapStateToProps)(CountText);

SalmoList.navigationOptions = props => ({
  title:
    props.navigation.state.params && props.navigation.state.params.categoria
      ? props.navigation.state.params.categoria
      : 'Alfabético',
  headerRight: <ConnectedCountText />
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoList);
