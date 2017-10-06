import React from 'react';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import { Container, Content, Text } from 'native-base';
//import { SET_SALMO_CONTENT } from '../actions';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <ScrollView>
          <Content>
            <Text>Configuración</Text>
          </Content>
        </ScrollView>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

SettingsScreen.navigationOptions = props => ({
  title: 'Configuración'
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
