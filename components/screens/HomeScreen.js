import React from 'react';
import { connect } from 'react-redux';
import BaseScreen from './BaseScreen';
import { List, ListItem, Text } from 'native-base';

const HomeScreen = props => {
  var items = ['Aleluya', 'El lagarero'];
  return (
    <BaseScreen title={HomeScreen.navigationOptions.title} {...props}>
      <List
        dataArray={items}
        renderRow={item => (
          <ListItem>
            <Text>{item}</Text>
          </ListItem>
        )}
      />
    </BaseScreen>
  );
};

HomeScreen.navigationOptions = {
  title: 'Salmos'
};

export default connect()(HomeScreen);
