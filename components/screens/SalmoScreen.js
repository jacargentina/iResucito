import React from 'react';
import { connect } from 'react-redux';
import BaseScreen from './BaseScreen';

const SalmoScreen = props => {
  return <BaseScreen title={SalmoScreen.navigationOptions.title} {...props} />;
};

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

SalmoScreen.navigationOptions = {
  title: 'Salmo'
};

export default connect(mapStateToProps, mapDispatchToProps)(SalmoScreen);
