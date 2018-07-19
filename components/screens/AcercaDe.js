// @flow
import React from 'react';
import { connect } from 'react-redux';
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
import { hideAbout } from '../actions';
import I18n from '../translations';

var pack = require('../../app.json');
var cristo = require('../../img/cristo.jpg');

class AcercaDe extends React.Component<any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        animationType="slide"
        visible={this.props.aboutVisible}
        onBackButtonPress={() => this.props.closeAbout()}
        onRequestClose={() => this.props.closeAbout()}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'space-around'
          }}
          onPress={() => this.props.closeAbout()}>
          <Image
            source={this.props.cristo}
            style={{ width: 200, height: 300, marginTop: 20 }}
            resizeMode="contain"
          />
          <H1 style={{ color: 'red', fontWeight: 'bold', fontStyle: 'italic' }}>
            {this.props.appName}
          </H1>
          <Text style={{ textAlign: 'center', fontSize: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {I18n.t('ui.version')}: {this.props.version}
            </Text>
            {'\n'} Javier Castro, 2017-2018
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
            <Button
              style={{ margin: 5 }}
              primary
              rounded
              onPress={() => this.props.sendMail(this.props.version)}>
              <Icon name="mail" />
            </Button>
            <Button
              style={{ margin: 5 }}
              primary
              rounded
              onPress={() => this.props.sendTwitter()}>
              <Icon name="logo-twitter" />
            </Button>
          </View>
          <Text style={{ margin: 5, textAlign: 'center', fontSize: 11 }}>
            {I18n.t('ui.donate message')}
          </Text>
          <View>
            <Button iconLeft onPress={() => this.props.makeDonation()}>
              <Icon name="logo-usd" />
              <Text>{I18n.t('ui.donate button')}</Text>
            </Button>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    aboutVisible: state.ui.get('about_visible'),
    version: DeviceInfo.getReadableVersion(),
    appName: pack.displayName,
    cristo: cristo
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeAbout: () => {
      dispatch(hideAbout());
    },
    sendMail: version => {
      Linking.openURL(
        `mailto:javier.alejandro.castro@gmail.com&subject=iResucitó%20${version}`
      ).catch(err => {
        Alert.alert('Error', err.message);
      });
    },
    sendTwitter: () => {
      Linking.openURL('https://www.twitter.com/javi_ale_castro').catch(err => {
        Alert.alert('Error', err.message);
      });
    },
    makeDonation: () => {
      Linking.openURL('https://paypal.me/JaviAleCastro').catch(err => {
        Alert.alert('Error', err.message);
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcercaDe);
