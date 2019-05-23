// @flow
import React from 'react';
import { withNavigation } from 'react-navigation';
import { Text, Icon } from 'native-base';
import {
  Platform,
  View,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import commonTheme from '../native-base-theme/variables/platform';

const ModalView = (props: any) => {
  const { navigation, left, right } = props;
  const defaultClose = (
    <Icon
      name="close"
      style={{
        marginRight: 18,
        textAlign: 'center',
        color: commonTheme.brandPrimary
      }}
      onPress={() => navigation.goBack(null)}
    />
  );
  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flexGrow: 1 }}
        behavior={Platform.OS == 'android' ? null : 'padding'}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: 5
          }}>
          {left}
          {right || defaultClose}
        </View>
        <View
          style={{
            flex: 0,
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10
          }}>
          <Text
            style={{
              fontSize: commonTheme.fontSizeBase + 3,
              fontWeight: 'bold'
            }}>
            {props.title}
          </Text>
        </View>
        <View
          style={{
            flexGrow: 1
          }}>
          {props.children}
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}>
          {props.acceptButtons}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default withNavigation(ModalView);
