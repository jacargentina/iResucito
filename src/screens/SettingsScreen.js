// @flow
import React, { useContext } from 'react';
import { View, Alert } from 'react-native';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import {
  List,
  ListItem,
  Left,
  Body,
  Text,
  Icon,
  Right,
  Picker,
  Item
} from 'native-base';
import Switch from '../widgets/switch';
import { DataContext } from '../DataContext';
import I18n from '../translations';
import SalmosNavigatorOptions from '../SalmosNavigatorOptions';
import { getLocalesForPicker } from '../util';
import commonTheme from '../native-base-theme/variables/platform';
import AcercaDe from './AcercaDe';

const SettingsScreen = (props: any) => {
  const data = useContext(DataContext);
  const { initializeLocale, shareIndexPatch } = data;
  const { indexPatchExists, clearIndexPatch } = data.songsMeta;
  const { keys, setKey, save } = data.settings;
  const { show } = data.aboutDialog;

  const updateSetting = (key, value) => {
    setKey(key, value);
    save();
  };

  const confirmClearIndexPatch = locale => {
    Alert.alert(
      I18n.t('ui.confirmation'),
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          style: 'destructive',
          onPress: () => {
            clearIndexPatch().then(() => {
              initializeLocale(locale);
            });
          }
        },
        {
          text: I18n.t('ui.cancel'),
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };

  var devModePatch = keys.developerMode && indexPatchExists;
  var localesItems = getLocalesForPicker().map(l => {
    return <Item key={l.value} label={l.label} value={l.value} />;
  });
  return (
    <AndroidBackHandler onBackPress={() => true}>
      <AcercaDe />
      <View>
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
                  margin: 0
                }}
                headerStyle={{
                  backgroundColor:
                    SalmosNavigatorOptions.headerStyle.backgroundColor
                }}
                headerBackButtonTextStyle={{
                  color: SalmosNavigatorOptions.headerTitleStyle.color
                }}
                headerTitleStyle={{
                  color: SalmosNavigatorOptions.headerTitleStyle.color
                }}
                selectedValue={keys.locale}
                onValueChange={val => {
                  // IMPORTANTE!
                  // Workaround de problema en Android
                  // https://github.com/facebook/react-native/issues/15556
                  setTimeout(() => {
                    updateSetting('locale', val);
                    // Para forzar refresco del titulo segun idioma nuevo
                    props.navigation.setParams({ title: '' });
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
              <Switch
                value={keys.keepAwake}
                onValueChange={checked => updateSetting('keepAwake', checked)}
              />
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text>{I18n.t('settings_title.developer mode')}</Text>
              <Text note>{I18n.t('settings_note.developer mode')}</Text>
            </Body>
            <Right>
              <Switch
                value={keys.developerMode}
                onValueChange={checked => {
                  updateSetting('developerMode', checked);
                }}
              />
            </Right>
          </ListItem>
          {devModePatch && (
            <ListItem>
              <Body>
                <Text
                  style={{ color: commonTheme.brandDanger }}
                  onPress={() => confirmClearIndexPatch(keys.locale)}>
                  {I18n.t('settings_title.clear index patch')}
                </Text>
              </Body>
            </ListItem>
          )}
          {devModePatch && (
            <ListItem>
              <Body>
                <Text onPress={shareIndexPatch}>
                  {I18n.t('settings_title.share index patch')}
                </Text>
              </Body>
            </ListItem>
          )}
          <ListItem icon button onPress={show}>
            <Left>
              <Icon name="checkmark" />
            </Left>
            <Body>
              <Text>{I18n.t('settings_title.about')}</Text>
            </Body>
          </ListItem>
        </List>
      </View>
    </AndroidBackHandler>
  );
};

SettingsScreen.navigationOptions = () => ({
  title: I18n.t('screen_title.settings'),
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

export default SettingsScreen;
