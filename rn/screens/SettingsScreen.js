// @flow
import React, { useContext } from 'react';
import { View } from 'react-native';
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
} from 'native-base';
import Switch from '../widgets/switch';
import { useNavigation } from '@react-navigation/native';
import { DataContext } from '../DataContext';
import I18n from '../../translations';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import { getLocalesForPicker } from '../../common';
import { getDefaultLocale } from '../util';

const SettingsScreen = () => {
  const data = useContext(DataContext);
  const navigation = useNavigation();
  const [locale, setLocale] = data.locale;
  const [keepAwake, setKeepAwake] = data.keepAwake;

  var localesItems = getLocalesForPicker(getDefaultLocale()).map((l) => {
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

export default SettingsScreen;
