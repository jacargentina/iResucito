// @flow
import React, { useContext } from 'react';
import {
  TouchableOpacity,
  Image,
  Modal,
  Linking,
  Alert,
  View
} from 'react-native';
import { Text, Icon, H1, Button } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import I18n from '../translations';
import { DataContext } from '../DataContext';

const pack = require('../../app.json');
const cristo = require('../../img/cristo.jpg');
const version = DeviceInfo.getReadableVersion();
const appName = pack.displayName;

const AcercaDe = () => {
  const data = useContext(DataContext);
  const { visible, hide } = data.aboutDialog;

  const sendMail = () => {
    Linking.openURL(
      `mailto:javier.alejandro.castro@gmail.com&subject=iResucitó%20${version}`
    ).catch(err => {
      Alert.alert('Error', err.message);
    });
  };

  const sendTwitter = () => {
    Linking.openURL('https://www.twitter.com/javi_ale_castro').catch(err => {
      Alert.alert('Error', err.message);
    });
  };

  const makeDonation = () => {
    Linking.openURL('https://paypal.me/JaviAleCastro').catch(err => {
      Alert.alert('Error', err.message);
    });
  };

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onBackButtonPress={hide}
      onRequestClose={hide}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
        onPress={hide}>
        <Image
          source={cristo}
          style={{ width: 200, height: 300, marginTop: 20 }}
          resizeMode="contain"
        />
        <H1 style={{ color: 'red', fontWeight: 'bold', fontStyle: 'italic' }}>
          {appName}
        </H1>
        <Text style={{ textAlign: 'center', fontSize: 12 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {I18n.t('ui.version')}: {version}
          </Text>
          {'\n'} Javier Castro, 2017-2019
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 12 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {I18n.t('ui.collaborators')}
          </Text>
          {'\n'} Matheus Fragoso (pt)
        </Text>
        <View
          style={{
            flexDirection: 'row'
          }}>
          <Button style={{ margin: 5 }} primary rounded onPress={sendMail}>
            <Icon name="mail" />
          </Button>
          <Button style={{ margin: 5 }} primary rounded onPress={sendTwitter}>
            <Icon name="logo-twitter" />
          </Button>
        </View>
        <Text style={{ margin: 5, textAlign: 'center', fontSize: 11 }}>
          {I18n.t('ui.donate message')}
        </Text>
        <View>
          <Button iconLeft onPress={makeDonation}>
            <Icon name="logo-usd" />
            <Text>{I18n.t('ui.donate button')}</Text>
          </Button>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default AcercaDe;
