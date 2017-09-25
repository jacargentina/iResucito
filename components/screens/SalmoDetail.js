import React from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import BaseScreen from './BaseScreen';

const SalmoDetail = props => {
  return (
    <BaseScreen {...props}>
      <Text>{props.salmo.titulo}</Text>
    </BaseScreen>
  );
};

const mapStateToProps = state => {
  var salmo = state.ui.get('salmoActual');
  return {
    salmo: salmo,
    title: salmo.titulo
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

SalmoDetail.navigationOptions = {
  title: 'Salmo'
};

export default connect(mapStateToProps, mapDispatchToProps)(SalmoDetail);
