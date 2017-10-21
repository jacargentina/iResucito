import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { Alert, FlatList, ScrollView } from 'react-native';
import Swipeout from 'react-native-swipeout';
import BaseScreen from './BaseScreen';
import SalmoListItem from './SalmoListItem';
import SalmoChooser from './SalmoChooser';
import { LIST_REMOVE_SALMO, LIST_SHARE } from '../actions';
import { getSalmosFromList } from '../selectors';
import AppNavigatorConfig from '../AppNavigatorConfig';

const ListDetail = props => {
  if (props.list.type == 'libre') {
    return (
      <BaseScreen>
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
  }
  return (
    <ScrollView
      style={{
        flex: 1
      }}>
      <SalmoChooser listMap={props.listMap} listKey="entrada" />
      <SalmoChooser listMap={props.listMap} listKey="1" />
      <SalmoChooser listMap={props.listMap} listKey="2" />
      <SalmoChooser listMap={props.listMap} listKey="3" />
      {props.listMap.has('4') && (
        <SalmoChooser listMap={props.listMap} listKey="4" />
      )}
      {props.listMap.has('paz') && (
        <SalmoChooser listMap={props.listMap} listKey="paz" />
      )}
      {props.listMap.has('comunion') && (
        <SalmoChooser listMap={props.listMap} listKey="comunion" />
      )}
      <SalmoChooser listMap={props.listMap} listKey="salida" />
    </ScrollView>
  );
};

const mapStateToProps = (state, props) => {
  return {
    list: props.navigation.state.params.list,
    listMap: getSalmosFromList(state, props)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    salmoDelete: (list, salmo) => {
      Alert.alert(`Eliminar "${salmo.titulo}"`, '¿Confirma el borrado?', [
        {
          text: 'Eliminar',
          onPress: () =>
            dispatch({
              type: LIST_REMOVE_SALMO,
              list: list.name,
              salmo: salmo
            }),
          style: 'destructive'
        },
        {
          text: 'Cancelar',
          style: 'cancel'
        }
      ]);
    },
    listShare: (list, items) => {
      dispatch({ type: LIST_SHARE, list: list.name, items: items });
    }
  };
};

const ShareList = props => {
  if (props.listMap.keys().length == 0) {
    return null;
  }
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 12,
        color: AppNavigatorConfig.navigationOptions.headerTitleStyle.color
      }}
      onPress={() =>
        props.listShare(props.navigation.state.params.list, props.items)}
    />
  );
};

const ShareListButton = connect(mapStateToProps, mapDispatchToProps)(ShareList);

ListDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.list.name
    : 'Lista',
  headerRight: <ShareListButton {...props} />
});

export default connect(mapStateToProps, mapDispatchToProps)(ListDetail);
