// @flow
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import {
  Button,
  List,
  ListItem,
  Body,
  Text,
  Icon,
  Right,
  Picker,
  H1,
} from 'native-base';
import Switch from '../widgets/switch';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from '../DataContext';
import I18n from '../../translations';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import { getLocalesForPicker } from '../../common';
import { getDefaultLocale } from '../util';
import DeviceInfo from 'react-native-device-info';
import commonTheme from '../native-base-theme/variables/platform';

const pack = require('../../app.json');
const collaborators = require('../../songs/collaborators.json');
const cristo = require('../../img/cristo.jpg');
const appName = pack.displayName;

const SettingsScreen = () => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const [locale, setLocale] = data.locale;
  const [keepAwake, setKeepAwake] = data.keepAwake;
  const [version, setVersion] = useState('');

  useEffect(() => {
    setVersion(DeviceInfo.getReadableVersion());
  }, []);

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

  var localesItems = getLocalesForPicker(getDefaultLocale()).map((l) => {
    return <Picker.Item key={l.value} label={l.label} value={l.value} />;
  });

  return (
    <AndroidBackHandler onBackPress={() => true}>
      <ScrollView>
        <List>
          <ListItem>
            <Body>
              <Text>{I18n.t('settings_title.locale')}</Text>
              <Text note>{I18n.t('settings_note.locale')}</Text>
              <Picker
                headerBackButtonText={I18n.t('ui.back')}
                iosHeader={I18n.t('settings_title.locale')}
                textStyle={{
                  padding: 0,
                  margin: 0,
                }}
                headerStyle={{
                  backgroundColor: StackNavigatorOptions().headerStyle
                    .backgroundColor,
                }}
                headerBackButtonTextStyle={{
                  color: StackNavigatorOptions().headerTitleStyle.color,
                }}
                headerTitleStyle={{
                  color: StackNavigatorOptions().headerTitleStyle.color,
                }}
                selectedValue={locale}
                onValueChange={(val) => {
                  // IMPORTANTE!
                  // Workaround de problema en Android
                  // https://github.com/facebook/react-native/issues/15556
                  setTimeout(() => {
                    setLocale(val);
                    // Para forzar refresco del titulo segun idioma nuevo
                    navigation.setParams({ title: '' });
                  }, 10);
                }}>
                {localesItems}
              </Picker>
            </Body>
          </ListItem>
          <ListItem>
            <Body>
              <Text>{I18n.t('settings_title.keep awake')}</Text>
              <Text note>{I18n.t('settings_note.keep awake')}</Text>
            </Body>
            <Right>
              <Switch value={keepAwake} onValueChange={setKeepAwake} />
            </Right>
          </ListItem>
          <View
            style={{
              flex: 1,
              backgroundColor: 'white',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <Image
              source={cristo}
              style={{
                height: 190,
                marginTop: 40,
              }}
              resizeMode="contain"
            />
            <H1
              style={{
                color: commonTheme.brandPrimary,
                fontWeight: 'bold',
                fontStyle: 'italic',
                marginTop: 40,
              }}>
              {appName}
            </H1>
            <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>
                {I18n.t('ui.version')}: {version}
              </Text>
              {'\n'} Javier Castro, 2017-2020
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 40 }}>
              <Text style={{ fontWeight: 'bold' }}>
                {I18n.t('ui.collaborators')}
              </Text>
              {Object.keys(collaborators).map((lang) => {
                return `\n ${collaborators[lang].join(', ')} (${lang})`;
              })}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                marginBottom: 20,
              }}>
              <Button style={{ margin: 5 }} primary rounded onPress={sendMail}>
                <Icon name="mail" />
              </Button>
              <Button
                style={{ margin: 5 }}
                primary
                rounded
                onPress={sendTwitter}>
                <Icon name="logo-twitter" />
              </Button>
            </View>
            {Platform.OS !== 'android' && (
              <>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 14,
                  }}>
                  {I18n.t('ui.donate message')}
                </Text>
                <View style={{ marginTop: 20, marginBottom: 20 }}>
                  <Button iconLeft onPress={makeDonation}>
                    <Icon name="logo-usd" />
                    <Text>{I18n.t('ui.donate button')}</Text>
                  </Button>
                </View>
              </>
            )}
          </View>
        </List>
      </ScrollView>
    </AndroidBackHandler>
  );
};

export default SettingsScreen;
