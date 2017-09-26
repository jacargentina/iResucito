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
  var salmo = state.ui.get('salmo_detail');
  return {
    salmo: salmo,
    title: salmo.titulo
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

SalmoDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.titulo
    : 'Salmo'
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoDetail);
