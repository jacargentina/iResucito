import React from 'react';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { Alert, FlatList } from 'react-native';
import Swipeout from 'react-native-swipeout';
import BaseScreen from './BaseScreen';
import { LIST_REMOVE_SALMO } from '../actions';
import SalmoListItem from './SalmoListItem';
import { getSalmosFromList } from '../selectors';

const ListDetail = props => {
  if (props.items.length == 0) {
    var sinItems = (
      <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
        Ningún salmo agregado
      </Text>
    );
  }
  return (
    <BaseScreen>
      {sinItems}
      <FlatList
        data={props.items}
        keyExtractor={item => item.path}
        renderItem={({ item }) => {
          var swipeoutBtns = [
            {
              text: 'Eliminar',
              type: 'delete',
              onPress: () => {
                props.salmoDelete(props.list, item);
              }
            }
          ];
          return (
            <Swipeout
              right={swipeoutBtns}
              backgroundColor="white"
              autoClose={true}>
              <SalmoListItem
                showBadge={true}
                salmo={item}
                navigation={props.navigation}
              />
            </Swipeout>
          );
        }}
      />
    </BaseScreen>
  );
};

const mapStateToProps = (state, props) => {
  return {
    list: props.navigation.state.params.list,
    items: getSalmosFromList(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    salmoDelete: (list, salmo) => {
      Alert.alert(`Eliminar "${salmo.titulo}"`, '¿Confirma el borrado?', [
        {
          text: 'Eliminar',
          onPress: () =>
            dispatch({ type: LIST_REMOVE_SALMO, list: list, salmo: salmo }),
          style: 'destructive'
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]);
    }
  };
};

ListDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.list.name
    : 'Lista'
});

export default connect(mapStateToProps, mapDispatchToProps)(ListDetail);
