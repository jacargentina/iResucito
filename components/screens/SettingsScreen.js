import React from 'react';
import { connect } from 'react-redux';
import {
  List,
  ListItem,
  Left,
  Body,
  Text,
  Icon,
  Right,
  Switch
} from 'native-base';
import { SET_SETTINGS_VALUE, SET_ABOUT_VISIBLE } from '../actions';
import BaseScreen from './BaseScreen';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BaseScreen>
        <List>
          <ListItem>
            <Body>
              <Text>Mantener despierto</Text>
              <Text note>
                Evitar que el dispositivo entre en reposo al visualizar un salmo
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
              <Text onPress={() => this.props.showAbout()}>Acerca de</Text>
            </Body>
          </ListItem>
        </List>
      </BaseScreen>
    );
  }
}
const mapStateToProps = state => {
  var set = state.ui.get('settings');
  return {
    keepAwake: set.get('keepAwake'),
    aboutVisible: state.ui.get('about_visible')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateSetting: (key, value) => {
      dispatch({ type: SET_SETTINGS_VALUE, key: key, value: value });
    },
    showAbout: () => {
      dispatch({ type: SET_ABOUT_VISIBLE, visible: true });
    }
  };
};

SettingsScreen.navigationOptions = () => ({
  title: 'Configuración',
  tabBarIcon: ({ focused, tintColor }) => {
    return (
      <Icon
        name="settings"
        active={focused}
        style={{ marginTop: 6, color: tintColor }}
      />
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
