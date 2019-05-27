// @flow
import React from 'react';
import { withNavigation } from 'react-navigation';
import { Text, Button } from 'native-base';
import {
  Platform,
  View,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import I18n from '../translations';
import commonTheme from '../native-base-theme/variables/platform';

const ModalView = (props: any) => {
  const { navigation, left, right } = props;
  const defaultClose = (
    <Button
      rounded
      small
      style={{
        alignSelf: 'flex-end',
        color: commonTheme.brandPrimary,
        marginRight: 10
      }}
      onPress={() => navigation.goBack(null)}>
      <Text>{I18n.t('ui.close')}</Text>
    </Button>
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
            justifyContent: 'space-between'
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center'
            }}>
            {left}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center'
            }}>
            {right || defaultClose}
          </View>
        </View>
        {props.title && (
          <View
            style={{
              flex: 0,
              alignItems: 'center',
              paddingTop: 12,
              paddingBottom: 12
            }}>
            <Text
              style={{
                fontSize: commonTheme.fontSizeBase + 3,
                fontWeight: 'bold'
              }}>
              {props.title}
            </Text>
          </View>
        )}
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
