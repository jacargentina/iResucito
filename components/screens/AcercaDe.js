import React from 'react';
import { connect } from 'react-redux';
import { TouchableOpacity, Image, Modal } from 'react-native';
import { Text, Icon, H1 } from 'native-base';
import DeviceInfo from 'react-native-device-info';
import { SET_ABOUT_VISIBLE } from '../actions';

var pack = require('../../app.json');
var cristo = require('../../img/cristo.jpg');

class AcercaDe extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        visible={this.props.aboutVisible}
        onBackButtonPress={() => this.props.closeAbout()}
        onBackdropPress={() => this.props.closeAbout()}>
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
            style={{ width: 300, height: 400 }}
            resizeMode="contain"
          />
          <H1 style={{ color: 'red', fontWeight: 'bold', fontStyle: 'italic' }}>
            {this.props.appName}
          </H1>
          <Text style={{ textAlign: 'center' }}>
            Versión: {this.props.version}
            {'\n'}
            <Icon name="contact" style={{ fontSize: 16 }} active /> Javier
            Castro, 2017
          </Text>
        </TouchableOpacity>
      </Modal>
    );
  }
}

const mapStateToProps = state => {
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
      dispatch({ type: SET_ABOUT_VISIBLE, visible: false });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AcercaDe);
