// @flow
import React, { useContext, useEffect } from 'react';
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
  Picker
} from 'native-base';
import Switch from '../widgets/switch';
import { DataContext } from '../DataContext';
import I18n from '../../translations';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import { getLocalesForPicker } from '../../common';
import { getDefaultLocale } from '../util';
import commonTheme from '../native-base-theme/variables/platform';

const titleLocaleKey = 'screen_title.settings';

const SettingsScreen = (props: any) => {
  const data = useContext(DataContext);
  const [devMode, setDevMode] = data.developerMode;
  const [locale, setLocale] = data.locale;
  const [keepAwake, setKeepAwake] = data.keepAwake;
  const { navigation } = props;
  const { shareIndexPatch } = data;
  const { indexPatchExists, clearIndexPatch } = data.songsMeta;

  useEffect(() => {
    navigation.setParams({ title: I18n.t(titleLocaleKey) });
  }, [I18n.locale]);

  const confirmClearIndexPatch = () => {
    Alert.alert(
      I18n.t('ui.confirmation'),
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.delete'),
          style: 'destructive',
          onPress: () => {
            clearIndexPatch();
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

  var devModePatch = devMode && indexPatchExists;
  var localesItems = getLocalesForPicker(getDefaultLocale()).map(l => {
    return <Picker.Item key={l.value} label={l.label} value={l.value} />;
  });
  return (
    <AndroidBackHandler onBackPress={() => true}>
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
                    StackNavigatorOptions.headerStyle.backgroundColor
                }}
                headerBackButtonTextStyle={{
                  color: StackNavigatorOptions.headerTitleStyle.color
                }}
                headerTitleStyle={{
                  color: StackNavigatorOptions.headerTitleStyle.color
                }}
                selectedValue={locale}
                onValueChange={val => {
                  // IMPORTANTE!
                  // Workaround de problema en Android
                  // https://github.com/facebook/react-native/issues/15556
                  setTimeout(() => {
                    setLocale(val);
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
              <Switch value={keepAwake} onValueChange={setKeepAwake} />
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text>{I18n.t('settings_title.developer mode')}</Text>
              <Text note>{I18n.t('settings_note.developer mode')}</Text>
            </Body>
            <Right>
              <Switch value={devMode} onValueChange={setDevMode} />
            </Right>
          </ListItem>
          {devModePatch && (
            <ListItem>
              <Body>
                <Text
                  style={{ color: commonTheme.brandDanger }}
                  onPress={() => confirmClearIndexPatch()}>
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
          <ListItem icon button onPress={() => navigation.navigate('About')}>
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

SettingsScreen.navigationOptions = () => {
  return { title: I18n.t(titleLocaleKey) };
};

export default SettingsScreen;
