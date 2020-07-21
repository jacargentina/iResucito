// @flow
import React, { Fragment, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  View,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Text, Icon, H1, Button } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import I18n from '../../translations';

const pack = require('../../app.json');
const cristo = require('../../img/cristo.jpg');
const appName = pack.displayName;

const AboutDialog = (props: any) => {
  const { navigation } = props;
  const [version, setVersion] = useState('');

  useEffect(() => {
    setVersion(DeviceInfo.getReadableVersion());
  }, []);

  const hide = () => {
    navigation.goBack(null);
  };

  const sendMail = () => {
    Linking.openURL(
      `mailto:javier.alejandro.castro@gmail.com&subject=iResucitó%20${version}`
    ).catch((err) => {
      Alert.alert('Error', err.message);
    });
  };

  const sendTwitter = () => {
    Linking.openURL('https://www.twitter.com/javi_ale_castro').catch((err) => {
      Alert.alert('Error', err.message);
    });
  };

  const makeDonation = () => {
    Linking.openURL('https://paypal.me/JaviAleCastro').catch((err) => {
      Alert.alert('Error', err.message);
    });
  };

  return (
    <SafeAreaView
      forceInset={{ top: 'always', bottom: 'always' }}
      style={{ flexGrow: 1 }}>
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'space-around',
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
          {'\n'} Javier Castro, 2017-2020
        </Text>
        <Text style={{ textAlign: 'center', fontSize: 12 }}>
          <Text style={{ fontWeight: 'bold' }}>
            {I18n.t('ui.collaborators')}
          </Text>
          {'\n'} Javier Suarez Suarez (es)
          {'\n'} Matheus Fragoso (pt-BR)
          {'\n'} Fabio Reis (pt-PT)
          {'\n'} David Hernández Durán (lt-LT)
        </Text>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <Button style={{ margin: 5 }} primary rounded onPress={sendMail}>
            <Icon name="mail" />
          </Button>
          <Button style={{ margin: 5 }} primary rounded onPress={sendTwitter}>
            <Icon name="logo-twitter" />
          </Button>
        </View>
        {Platform.OS !== 'android' && (
          <Fragment>
            <Text style={{ margin: 5, textAlign: 'center', fontSize: 11 }}>
              {I18n.t('ui.donate message')}
            </Text>
            <View>
              <Button iconLeft onPress={makeDonation}>
                <Icon name="logo-usd" />
                <Text>{I18n.t('ui.donate button')}</Text>
              </Button>
            </View>
          </Fragment>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AboutDialog;
