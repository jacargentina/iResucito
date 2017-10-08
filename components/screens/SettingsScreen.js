import React from 'react';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Body,
  Text,
  Icon,
  Right,
  Switch
} from 'native-base';
import { SET_SETTINGS_VALUE } from '../actions';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListItem>
              <Body>
                <Text>Mantener despierto</Text>
                <Text note>
                  Evitar que el dispositivo entre en reposo al visualizar un
                  salmo
                </Text>
              </Body>
              <Right>
                <Switch
                  value={this.props.keepAwake}
                  onValueChange={checked =>
                    this.props.updateSetting('keepAwake', checked)}
                />
              </Right>
            </ListItem>
            <ListItem icon>
              <Left>
                <Icon name="help-circle" />
              </Left>
              <Body>
                <Text>Acerca de</Text>
              </Body>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  var set = state.ui.get('settings');
  return {
    keepAwake: set.get('keepAwake')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateSetting: (key, value) => {
      dispatch({ type: SET_SETTINGS_VALUE, key: key, value: value });
    }
  };
};

SettingsScreen.navigationOptions = props => ({
  title: 'Configuración'
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
