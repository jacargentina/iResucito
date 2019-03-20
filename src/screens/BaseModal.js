// @flow
import React from 'react';
import { withNavigation } from 'react-navigation';
import { Text, Icon } from 'native-base';
import { View, Platform, SafeAreaView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
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
    <KeyboardAwareScrollView>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            flex: 1,
            paddingTop: Platform.OS == 'ios' ? 23 : 0,
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
              flex: 1
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
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default withNavigation(BaseModal);
