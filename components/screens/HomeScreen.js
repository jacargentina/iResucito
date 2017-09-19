import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem, Text } from 'native-base';
import { _ } from 'lodash';
import BaseScreen from './BaseScreen';

import { SET_SALMOS_FILTER } from '../actions';

const HomeScreen = props => {
  return (
    <BaseScreen
      title={HomeScreen.navigationOptions.title}
      {...props}
      searchHandler={props.filtrarHandler}>
      <List
        dataArray={props.items}
        renderRow={item => (
          <ListItem>
            <Text>{item.name}</Text>
          </ListItem>
        )}
      />
    </BaseScreen>
  );
};

const mapStateToProps = state => {
  var salmos = state.ui.get('salmos');
  var items = salmos ? salmos.alfabetico : [];
  var filter = state.ui.get('salmos_filter');
  if (filter) {
    items = items.filter(s => {
      return s.name.includes(filter);
    });
  }
  return {
    items: items
  };
};

const mapDispatchToProps = dispatch => {
  var filtrar = text => {
    console.log('Filtar', text);
    dispatch({ type: SET_SALMOS_FILTER, filter: text });
  };

  return {
    filtrarHandler: _.debounce(filtrar, 600)
  };
};

HomeScreen.navigationOptions = {
  title: 'Salmos'
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
