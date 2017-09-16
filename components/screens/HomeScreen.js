import React from 'react';
import { connect } from 'react-redux';
import BaseScreen from './BaseScreen';
import { List, ListItem, Text } from 'native-base';

const HomeScreen = props => {
  return (
    <BaseScreen title={HomeScreen.navigationOptions.title} {...props}>
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
  return {
    items: salmos ? salmos.alfabetico : []
  };
};

HomeScreen.navigationOptions = {
  title: 'Salmos'
};

export default connect(mapStateToProps)(HomeScreen);
