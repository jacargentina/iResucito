import React from 'react';
import { Text, Icon } from 'native-base';
import { View, Platform } from 'react-native';
import Modal from 'react-native-modal';
import commonTheme from '../../native-base-theme/variables/platform';

const BaseModal = props => {
  // Por algun motivo que desconozco, en Android con true
  // en vez de solucionar, lo rompe. Lo dejo solo para iOS
  var avoidKeyboard = Platform.OS == 'ios' ? true : false;
  var animationIn = props.fade ? 'fadeIn' : 'slideInUp';
  var animationOut = props.fade ? 'fadeOut' : 'slideOutDown';
  var closeButton = props.closeButton ? (
    props.closeButton
  ) : (
    <Icon
      name="close"
      style={{
        width: 32,
        fontSize: 40,
        textAlign: 'center',
        color: commonTheme.brandPrimary
      }}
      onPress={() => props.closeModal()}
    />
  );
  return (
    <Modal
      style={{ margin: 0 }}
      avoidKeyboard={avoidKeyboard}
      isVisible={props.visible}
      animationIn={animationIn}
      animationOut={animationOut}
      onBackButtonPress={() => props.closeModal()}
      onBackdropPress={() => props.closeModal()}
      onModalHide={() => props.modalHide()}
      onModalShow={() => props.modalShow()}>
      <View
        style={{
          flex: 1,
          paddingTop: 23,
          backgroundColor: 'white'
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 5
          }}>
          <Text
            style={{
              fontSize: commonTheme.fontSizeBase + 3,
              fontWeight: 'bold',
              paddingLeft: 10
            }}>
            {props.title}
          </Text>
          {closeButton}
        </View>
        <View
          style={{
            flex: 1,
          }}>
          {props.children}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}>
          {props.acceptButtons}
        </View>
      </View>
    </Modal>
  );
};

BaseModal.defaultProps = {
  visible: false,
  title: '',
  closeModal: () => {},
  modalShow: () => {},
  modalHide: () => {}
};

export default BaseModal;
