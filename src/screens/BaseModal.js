// @flow
import React from 'react';
import { withNavigation } from 'react-navigation';
import { Text, Icon } from 'native-base';
import { View, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import commonTheme from '../native-base-theme/variables/platform';

const BaseModal = (props: any) => {
  const { navigation } = props;
  var closeButton = props.closeButton ? (
    props.closeButton
  ) : (
    <Icon
      name="close"
      style={{
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: commonTheme.brandPrimary
      }}
      onPress={() => navigation.goBack(null)}
    />
  );
  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
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
            flex: 1
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

export default withNavigation(BaseModal);
