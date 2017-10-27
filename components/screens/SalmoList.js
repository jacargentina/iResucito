import React from 'react';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { FlatList } from 'react-native';
import SearchBarView from './SearchBarView';
import SalmoListItem from './SalmoListItem';
import AppNavigatorConfig from '../AppNavigatorConfig';
import { setSalmosFilterText } from '../actions';
import {
  getProcessedSalmos,
  getShowSalmosBadge,
  getCurrentRouteKey,
  getCurrentRouteSalmosTextFilter
} from '../selectors';

const SalmoList = props => {
  return (
    <SearchBarView
      searchTextFilterId={props.textFilterId}
      searchTextFilter={props.textFilter}
      searchHandler={props.filtrarHandler}>
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
    </SearchBarView>
  );
};

const mapStateToProps = state => {
  return {
    textFilterId: getCurrentRouteKey(state),
    textFilter: getCurrentRouteSalmosTextFilter(state),
    items: getProcessedSalmos(state),
    showBadge: getShowSalmosBadge(state)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    filtrarHandler: (inputId, text) => {
      dispatch(setSalmosFilterText(inputId, text));
    },
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
