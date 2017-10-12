import React from 'react';
import { connect } from 'react-redux';
import { ListItem, Left, Right, Body, Icon, Text, Button } from 'native-base';
import { FlatList } from 'react-native';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';
import ListChooser from './ListChooser';
import { appNavigatorConfig } from '../AppNavigator';
import {
  SET_SALMOS_FILTER,
  SET_LIST_CHOOSER_VISIBLE,
  SET_SALMOS_SELECTED
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
      <ListChooser />
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
              }}>
              {badgeWrapper}
              <Body>
                <Text>{item.titulo}</Text>
                <Text note>{item.fuente}</Text>
              </Body>
              <Right>
                <Button
                  small
                  bordered
                  rounded
                  onPress={() => props.showSalmosAdd(item)}>
                  <Icon name="add" />
                </Button>
              </Right>
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
  var badges = state.ui.get('badges');
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
    showBadge: filter == null || !filter.hasOwnProperty('etapa'),
    badges: badges
  };
};

const mapDispatchToProps = dispatch => {
  var filtrar = text => {
    dispatch({ type: SET_SALMOS_FILTER, filter: text });
  };

  return {
    filtrarHandler: _.debounce(filtrar, 600),
    showSalmosAdd: salmo => {
      dispatch({ type: SET_SALMOS_SELECTED, salmo: salmo });
      dispatch({ type: SET_LIST_CHOOSER_VISIBLE, visible: true });
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
