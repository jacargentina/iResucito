import React from 'react';
import { connect } from 'react-redux';
import BaseScreen from './BaseScreen';
import { Text } from 'native-base';

const HomeScreen = props => {
  return (
    <BaseScreen title={HomeScreen.navigationOptions.title} {...props}>
      <Text> Lista </Text>
    </BaseScreen>
  );
};

HomeScreen.navigationOptions = {
  title: 'Salmos'
};

export default connect()(HomeScreen);
