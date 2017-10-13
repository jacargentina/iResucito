import React from 'react';
import { Text, Button, Icon } from 'native-base';
import { View, Platform } from 'react-native';
import Modal from 'react-native-modal';

const BaseModal = props => {
  // Por algun motivo que desconozco, en Android con true
  // en vez de solucionar, lo rompe. Lo dejo solo para iOS
  var avoidKeyboard = Platform.OS == 'ios' ? true : false;
  return (
    <Modal
      style={{ margin: 0 }}
      avoidKeyboard={avoidKeyboard}
      isVisible={props.visible}
      onBackButtonPress={() => props.closeModal()}
      onBackdropPress={() => props.closeModal()}
      onModalHide={() => props.modalHide()}
      onModalShow={() => props.modalShow()}>
      <View
        style={{
          flex: 1,
          padding: 10,
          backgroundColor: 'white'
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            marginTop: 10
          }}>
          <Text
            style={{
              fontWeight: 'bold'
            }}>
            {props.title}
          </Text>
          <Icon
            name="close"
            style={{
              width: 32,
              fontSize: 40,
              textAlign: 'center',
              color: 'red'
            }}
            onPress={() => props.closeModal()}
          />
        </View>
        <View
          style={{
            flex: 10,
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-start'
            }}>
            {props.children}
          </View>
          <Button
            style={{
              alignSelf: 'flex-end'
            }}
            primary
            onPress={() => props.acceptModal()}
            disabled={props.acceptDisabled}>
            <Text>{props.acceptText}</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

BaseModal.defaultProps = {
  visible: false,
  title: '',
  acceptDisabled: false,
  acceptText: 'Aceptar',
  closeModal: () => {},
  modalShow: () => {},
  modalHide: () => {},
  acceptModal: () => {}
};

export default BaseModal;
