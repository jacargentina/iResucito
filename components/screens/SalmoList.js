import React from 'react';
import { connect } from 'react-redux';
import { Text } from 'native-base';
import { FlatList } from 'react-native';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';
import SalmoListItem from './SalmoListItem';
import AppNavigatorConfig from '../AppNavigatorConfig';
import { filterSalmoList } from '../actions';
import { getProcessedSalmos, getShowSalmosBadge } from '../selectors';

const SalmoList = props => {
  return (
    <BaseScreen
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
    </BaseScreen>
  );
};

const mapStateToProps = state => {
  var textFilter = state.ui.get('salmos_text_filter');
  return {
    textFilter: textFilter,
    items: getProcessedSalmos(state),
    showBadge: getShowSalmosBadge(state)
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
