import React from 'react';
import { connect } from 'react-redux';
import { Icon, Text, Button } from 'native-base';
import { FlatList } from 'react-native';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';
import SalmoListItem from './SalmoListItem';
import { appNavigatorConfig } from '../AppNavigator';
import {
  SET_SALMOS_FILTER,
  SET_LIST_CHOOSER_VISIBLE,
  SET_LIST_ADD_VISIBLE,
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
      <FlatList
        data={props.items}
        keyExtractor={item => item.path}
        renderItem={({ item }) => {
          var buttons = (
            <Button
              small
              bordered
              rounded
              onPress={() => props.showSalmosAdd(props.showChooser, item)}>
              <Icon name="add" />
            </Button>
          );
          return (
            <SalmoListItem
              key={item.nombre}
              showBadge={props.showBadge}
              salmo={item}
              rightButtons={buttons}
              navigation={props.navigation}
            />
          );
        }}
      />
    </BaseScreen>
  );
};

const mapStateToProps = state => {
  var salmos = state.ui.get('salmos');
  var filter = state.ui.get('salmos_filter');
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
  var hasLists =
    state.ui
      .get('lists')
      .keySeq()
      .count() > 0;
  return {
    showChooser: hasLists,
    items: items,
    showBadge: filter == null || !filter.hasOwnProperty('etapa')
  };
};

const mapDispatchToProps = dispatch => {
  var filtrar = text => {
    dispatch({ type: SET_SALMOS_FILTER, filter: text });
  };

  return {
    filtrarHandler: _.debounce(filtrar, 600),
    showSalmosAdd: (showChooser, salmo) => {
      dispatch({ type: SET_SALMOS_SELECTED, salmo: salmo });
      if (showChooser) {
        dispatch({ type: SET_LIST_CHOOSER_VISIBLE, visible: true });
      } else {
        dispatch({ type: SET_LIST_ADD_VISIBLE, visible: true });
      }
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
