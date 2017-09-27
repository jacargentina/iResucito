import React from 'react';
import { connect } from 'react-redux';
import { Content, Text } from 'native-base';
import RNFS from 'react-native-fs';
import BaseScreen from './BaseScreen';
import { SET_SALMO_CONTENT } from '../actions';

class SalmoDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.load(this.props.salmo);
  }

  render() {
    return (
      <BaseScreen {...this.props}>
        <Content padder>
          <Text>{this.props.salmo.titulo}</Text>
          <Text note>{this.props.salmo.fuente}</Text>
          <Text>{this.props.text}</Text>
        </Content>
      </BaseScreen>
    );
  }
}

const mapStateToProps = state => {
  var salmo = state.ui.get('salmo_detail');
  var content = state.ui.get('salmo_content');
  return {
    salmo: salmo,
    text: content
  };
};

const loadSalmo = salmo => {
  return (dispatch, getState) => {
    RNFS.readFile(salmo.path).then(content => {
      dispatch({ type: SET_SALMO_CONTENT, content });
    });
  };
};

const mapDispatchToProps = dispatch => {
  return {
    load: salmo => dispatch(loadSalmo(salmo))
  };
};

SalmoDetail.navigationOptions = props => ({
  title: props.navigation.state.params
    ? props.navigation.state.params.salmo.titulo
    : 'Salmo'
});

export default connect(mapStateToProps, mapDispatchToProps)(SalmoDetail);
