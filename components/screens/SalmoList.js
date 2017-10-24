import React from 'react';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { FlatList } from 'react-native';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';
import SalmoListItem from './SalmoListItem';
import AppNavigatorConfig from '../AppNavigatorConfig';
import { filterSalmoList } from '../actions';

const SalmoList = props => {
  return (
    <BaseScreen {...props} searchHandler={props.filtrarHandler}>
      {props.items.length == 0 && (
        <Text note style={{ textAlign: 'center', paddingTop: 20 }}>
          Ningún salmo encontrado
        </Text>
      )}
      <FlatList
        data={props.items}
        keyExtractor={item => item.path}
        renderItem={({ item }) => {
          return (
            <SalmoListItem
              key={item.nombre}
              showBadge={props.showBadge}
              salmo={item}
              onPress={props.onPress}
            />
          );
        }}
      />
    </BaseScreen>
  );
};

const mapStateToProps = (state, props) => {
  var salmos = state.ui.get('salmos');
  var filter =
    props.navigation && props.navigation.state.params
      ? props.navigation.state.params.filter
      : props.filter;
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

const mapDispatchToProps = (dispatch, props) => {
  var filtrar = text => {
    dispatch(filterSalmoList(text));
  };

  return {
    filtrarHandler: _.debounce(filtrar, 600),
    onPress: salmo => {
      if (props.onPress) {
        props.onPress(salmo);
      } else {
        props.navigation.navigate('SalmoDetail', { salmo: salmo });
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
  headerRight: <ConnectedCountText {...props} />
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoList);
