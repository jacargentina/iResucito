import React from 'react';
import { connect } from 'react-redux';
import { Icon, Text } from 'native-base';
import { FlatList } from 'react-native';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';
import SalmoListItem from './SalmoListItem';
import AppNavigatorConfig from '../AppNavigatorConfig';
import { SET_SALMOS_FILTER, decideSalmoAddDialog } from '../actions';
import commonColor from '../../native-base-theme/variables/commonColor';

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
            <Icon
              style={{
                width: 32,
                fontSize: 40,
                textAlign: 'center',
                color: commonColor.brandPrimary
              }}
              name="bookmark"
              onPress={() => props.showSalmosAdd(item)}
            />
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
  return {
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
    showSalmosAdd: salmo => {
      dispatch(decideSalmoAddDialog(salmo));
    }
  };
};

const CountText = props => {
  return (
    <Text
      style={{
        marginRight: 8,
        fontSize: 10,
        color: AppNavigatorConfig.navigationOptions.headerTitleStyle.color
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
