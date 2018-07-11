// @flow
import React from 'react';
import { connect } from 'react-redux';
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
  Item
} from 'native-base';
import Switch from '../widgets/switch';
import {
  applySetting,
  saveSettings,
  showAbout,
  initializeLocale
} from '../actions';
import I18n from '../translations';
import AppNavigatorOptions from '../AppNavigatorOptions';
import { getLocalesForPicker } from '../util';

class SettingsScreen extends React.Component<any> {
  localesItems: Array<any>;

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
    if (!this.localesItems) {
      this.localesItems = getLocalesForPicker().map(l => {
        return <Item key={l.value} label={l.label} value={l.value} />;
      });
    }
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
                    this.props.updateSetting('locale', val);
                    // Para forzar refresco del titulo segun idioma nuevo
                    this.props.navigation.setParams({ title: '' });
                  }}>
                  {this.localesItems}
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
  return {
    locale: set.get('locale'),
    keepAwake: set.get('keepAwake'),
    aboutVisible: state.ui.get('about_visible')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateSetting: (key, value) => {
      if (key == 'locale') {
        dispatch(initializeLocale(value));
      }
      dispatch(applySetting(key, value));
      dispatch(saveSettings());
    },
    showAbout: () => {
      dispatch(showAbout());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
