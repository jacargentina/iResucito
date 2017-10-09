import React from 'react';
import { connect } from 'react-redux';
import { ScrollView, Modal, TouchableOpacity, Image } from 'react-native';
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
  Switch,
  H1,
  Button
} from 'native-base';
import DeviceInfo from 'react-native-device-info';
import { SET_SETTINGS_VALUE, SET_ABOUT_VISIBLE } from '../actions';

const SettingsScreen = props => {
  return (
    <Container>
      <Modal
        animationTyper="slide"
        visible={props.aboutVisible}
        onRequestClose={() => props.closeAbout()}>
        <TouchableOpacity
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
          onPress={() => props.closeAbout()}>
          <Image
            source={require('../../img/cristo.jpg')}
            style={{ width: 300, height: 400 }}
            resizeMode="contain"
          />
          <H1 style={{ color: 'red', fontWeight: 'bold', fontStyle: 'italic' }}>
            {require('../../app.json').displayName}
          </H1>
          <Text style={{ textAlign: 'center' }}>
            Versión: {DeviceInfo.getReadableVersion()}
            {'\n'}
            <Icon name="contact" style={{ fontSize: 16 }} active /> Javier
            Castro, 2017
          </Text>
        </TouchableOpacity>
      </Modal>
      <Content>
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
                value={props.keepAwake}
                onValueChange={checked =>
                  props.updateSetting('keepAwake', checked)}
              />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Icon name="help-circle" />
            </Left>
            <Body>
              <Text onPress={() => props.showAbout()}>Acerca de</Text>
            </Body>
          </ListItem>
        </List>
      </Content>
    </Container>
  );
};
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
    },
    closeAbout: () => {
      dispatch({ type: SET_ABOUT_VISIBLE, visible: false });
    }
  };
};

SettingsScreen.navigationOptions = props => ({
  title: 'Configuración'
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
