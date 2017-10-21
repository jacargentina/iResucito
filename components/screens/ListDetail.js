import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { Alert, FlatList, ScrollView } from 'react-native';
import Swipeout from 'react-native-swipeout';
import BaseScreen from './BaseScreen';
import SalmoListItem from './SalmoListItem';
import LiturgiaChooser from './LiturgiaChooser';
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
      <LiturgiaChooser listMap={props.listMap} listKey="ambiental" />
      <LiturgiaChooser listMap={props.listMap} listKey="entrada" />
      <LiturgiaChooser listMap={props.listMap} listKey="1-monicion" />
      <LiturgiaChooser listMap={props.listMap} listKey="1" />
      {props.listMap.has('1-salmo') && (
        <LiturgiaChooser listMap={props.listMap} listKey="1-salmo" />
      )}
      <LiturgiaChooser listMap={props.listMap} listKey="2-monicion" />
      <LiturgiaChooser listMap={props.listMap} listKey="2" />
      {props.listMap.has('2-salmo') && (
        <LiturgiaChooser listMap={props.listMap} listKey="2-salmo" />
      )}
      {props.listMap.has('3-monicion') && (
        <LiturgiaChooser listMap={props.listMap} listKey="3-monicion" />
      )}
      {props.listMap.has('3') && (
        <LiturgiaChooser listMap={props.listMap} listKey="3" />
      )}
      {props.listMap.has('3-salmo') && (
        <LiturgiaChooser listMap={props.listMap} listKey="3-salmo" />
      )}
      <LiturgiaChooser listMap={props.listMap} listKey="evangelio-monicion" />
      <LiturgiaChooser listMap={props.listMap} listKey="evangelio" />
      {props.listMap.has('paz') && (
        <LiturgiaChooser listMap={props.listMap} listKey="paz" />
      )}
      {props.listMap.has('comunion') && (
        <LiturgiaChooser listMap={props.listMap} listKey="comunion" />
      )}
      <LiturgiaChooser listMap={props.listMap} listKey="salida" />
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
