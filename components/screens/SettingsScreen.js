import React from 'react';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { List, ListItem, Left, Body, Text, Icon, Right } from 'native-base';
import Switch from '../widgets/switch';
import { saveSetting, showAbout } from '../actions';
import I18n from '../../i18n';

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <List>
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
      dispatch(saveSetting(key, value));
    },
    showAbout: () => {
      dispatch(showAbout());
    }
  };
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
