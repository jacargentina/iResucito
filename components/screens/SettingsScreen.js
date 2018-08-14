// @flow
import React from 'react';
import { connect } from 'react-redux';
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
  Item,
  Button
} from 'native-base';
import Switch from '../widgets/switch';
import {
  applySetting,
  saveSettings,
  showAbout,
  initializeLocale,
  clearIndexPatch,
  shareIndexPatch
} from '../actions';
import I18n from '../translations';
import AppNavigatorOptions from '../AppNavigatorOptions';
import { getLocalesForPicker } from '../util';
import commonTheme from '../../native-base-theme/variables/platform';

class SettingsScreen extends React.Component<any> {
  constructor(props) {
    super(props);
  }

  static navigationOptions = () => ({
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

  render() {
    var devModePatch = this.props.developerMode && this.props.patchExists;
    var localesItems = getLocalesForPicker().map(l => {
      return <Item key={l.value} label={l.label} value={l.value} />;
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
                      AppNavigatorOptions.headerStyle.backgroundColor
                  }}
                  headerBackButtonTextStyle={{
                    color: AppNavigatorOptions.headerTitleStyle.color
                  }}
                  headerTitleStyle={{
                    color: AppNavigatorOptions.headerTitleStyle.color
                  }}
                  selectedValue={this.props.locale}
                  onValueChange={val => {
                    // IMPORTANTE!
                    // Workaround de problema en Android
                    // https://github.com/facebook/react-native/issues/15556
                    setTimeout(() => {
                      this.props.updateSetting('locale', val);
                      this.props.reinitializeLocale(val);
                      // Para forzar refresco del titulo segun idioma nuevo
                      this.props.navigation.setParams({ title: '' });
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
                  value={this.props.keepAwake}
                  onValueChange={checked =>
                    this.props.updateSetting('keepAwake', checked)
                  }
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
                  value={this.props.developerMode}
                  onValueChange={checked => {
                    this.props.updateSetting('developerMode', checked);
                    this.props.reinitializeLocale(this.props.locale);
                  }}
                />
              </Right>
            </ListItem>
            {devModePatch && (
              <ListItem>
                <Body>
                  <Text
                    style={{ color: commonTheme.brandDanger }}
                    onPress={() =>
                      this.props.clearIndexPatch(this.props.locale)
                    }>
                    {I18n.t('settings_title.clear index patch')}
                  </Text>
                </Body>
              </ListItem>
            )}
            {devModePatch && (
              <ListItem>
                <Body>
                  <Text onPress={() => this.props.shareIndexPatch()}>
                    {I18n.t('settings_title.share index patch')}
                  </Text>
                </Body>
              </ListItem>
            )}
            <ListItem icon button onPress={() => this.props.showAbout()}>
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
  }
}
const mapStateToProps = state => {
  var set = state.ui.get('settings');
  var patchExists = state.ui.get('index_patch_exists');
  return {
    patchExists: patchExists,
    locale: set.get('locale'),
    keepAwake: set.get('keepAwake'),
    developerMode: set.get('developerMode'),
    aboutVisible: state.ui.get('about_visible')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateSetting: (key, value) => {
      dispatch(applySetting(key, value));
      dispatch(saveSettings());
    },
    reinitializeLocale: locale => {
      dispatch(initializeLocale(locale));
    },
    showAbout: () => {
      dispatch(showAbout());
    },
    clearIndexPatch: locale => {
      Alert.alert(
        I18n.t('ui.confirmation'),
        I18n.t('ui.delete confirmation'),
        [
          {
            text: I18n.t('ui.delete'),
            style: 'destructive',
            onPress: () => dispatch(clearIndexPatch(locale))
          },
          {
            text: I18n.t('ui.cancel'),
            style: 'cancel'
          }
        ],
        { cancelable: false }
      );
    },
    shareIndexPatch: () => {
      dispatch(shareIndexPatch());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
