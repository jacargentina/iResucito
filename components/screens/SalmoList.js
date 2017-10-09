import React from 'react';
import { connect } from 'react-redux';
import {
  ListItem,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Badge,
  Content,
  Container,
  Button,
  H2,
  Input,
  Item,
  Label
} from 'native-base';
import { FlatList, View } from 'react-native';
import Modal from 'react-native-modal';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';
import { appNavigatorConfig } from '../AppNavigator';
import {
  SET_SALMOS_FILTER,
  SET_SALMOS_ADD_VISIBLE,
  SALMO_SELECT,
  SALMO_ADD_TO_LIST
} from '../actions';

const SalmoList = props => {
  if (props.items.length == 0) {
    var sinItems = (
      <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
        Ningún salmo encontrado
      </Text>
    );
  }
  return (
    <BaseScreen {...props} searchHandler={props.filtrarHandler}>
      {sinItems}
      <Modal
        isVisible={props.salmos_add_visible}
        onBackButtonPress={() => props.closeSalmosAdd()}
        onBackdropPress={() => props.closeSalmosAdd()}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            padding: 20
          }}>
          <H2 style={{ paddingBottom: 15 }}>Crear lista</H2>
          <Item style={{ marginBottom: 30 }} floatingLabel>
            <Label>Nombre</Label>
            <Input />
          </Item>
          <Button primary block>
            <Text onPress={() => props.closeSalmosAdd()}>Agregar</Text>
          </Button>
          <H2 style={{ paddingTop: 30, paddingBottom: 15 }}>Agregar a lista</H2>
          <FlatList
            data={props.lists}
            keyExtractor={item => item.name}
            renderItem={({ item }) => {
              return (
                <ListItem
                  style={{ marginLeft: 0, paddingLeft: 0 }}
                  icon
                  onPress={() => {
                    //todo
                  }}>
                  <Left>
                    <Icon name="list" />
                  </Left>
                  <Body>
                    <Text>{item.name}</Text>
                  </Body>
                </ListItem>
              );
            }}
          />
          <Button danger block>
            <Text onPress={() => props.closeSalmosAdd()}>Cancelar</Text>
          </Button>
        </View>
      </Modal>
      <FlatList
        data={props.items}
        keyExtractor={item => item.path}
        renderItem={({ item }) => {
          if (props.showBadge) {
            var badgeWrapper = <Left>{props.badges[item.etapa]}</Left>;
          }
          return (
            <ListItem
              avatar={props.showBadge}
              onPress={() => {
                props.navigation.navigate('Detail', { salmo: item });
              }}
              onLongPress={() => props.showSalmosAdd(item)}>
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
  var filter = state.ui.get('salmos_filter');
  var menu = state.ui.get('menu');
  var badges = state.ui.get('badges');
  var salmos_add_visible = state.ui.get('salmos_add_visible');
  var items = [];
  if (salmos) {
    if (filter) {
      for (var name in filter) {
        items = salmos.filter(s => s[name] == filter[name]);
      }
    } else {
      items = salmos;
    }
  }
  var text_filter = state.ui.get('salmos_text_filter');
  if (text_filter) {
    items = items.filter(s => {
      return s.nombre.toLowerCase().includes(text_filter.toLowerCase());
    });
  }
  return {
    items: items,
    lists: [{ name: 'Prueba' }, { name: 'Segunda lista' }],
    showBadge: filter == null || !filter.hasOwnProperty('etapa'),
    badges: badges,
    salmos_add_visible: salmos_add_visible
  };
};

const mapDispatchToProps = dispatch => {
  var filtrar = text => {
    console.log('Filtar', text);
    dispatch({ type: SET_SALMOS_FILTER, filter: text });
  };

  return {
    filtrarHandler: _.debounce(filtrar, 600),
    showSalmosAdd: salmo => {
      dispatch({ type: SALMO_SELECT, salmo: salmo });
      dispatch({ type: SET_SALMOS_ADD_VISIBLE, visible: true });
    },
    closeSalmosAdd: () => {
      dispatch({ type: SET_SALMOS_ADD_VISIBLE, visible: false });
    },
    salmosAddToList: () => {
      dispatch({ type: SALMO_ADD_TO_LIST });
    }
  };
};

const CountText = props => {
  return (
    <Text
      style={{
        marginRight: 8,
        fontSize: 10,
        color: appNavigatorConfig.navigationOptions.headerTitleStyle.color
      }}>
      {props.items.length}
    </Text>
  );
};

const ConnectedCountText = connect(mapStateToProps)(CountText);

SalmoList.navigationOptions = props => ({
  title:
    props.navigation.state.params && props.navigation.state.params.title
      ? props.navigation.state.params.title
      : 'Sin titulo',
  headerRight: <ConnectedCountText />
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoList);
