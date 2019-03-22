// @flow
import React from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { Icon, Text, H1, Button } from 'native-base';
import { View } from 'react-native';
import commonTheme from '../native-base-theme/variables/platform';

const CallToAction = (props: any) => {
  return (
    <AndroidBackHandler onBackPress={() => true}>
      <View
        style={{
          flex: 1,
          padding: 20
        }}>
        <View
          style={{
            flex: 3,
            justifyContent: 'space-around',
            borderBottomWidth: 1,
            borderBottomColor: '#ccc'
          }}>
          <Icon
            name={props.icon}
            style={{
              fontSize: 120,
              color: commonTheme.brandPrimary,
              alignSelf: 'center'
            }}
          />
        </View>
        <H1 style={{ flex: 1, paddingTop: 20 }}>{props.title}</H1>
        <Text note style={{ flex: 2 }}>
          {props.text}
        </Text>
        <View
          style={{
            flex: 2,
            justifyContent: 'space-around'
          }}>
          <Button rounded block onPress={props.buttonHandler}>
            <Text>{props.buttonText}</Text>
          </Button>
        </View>
      </View>
    </AndroidBackHandler>
  );
};

export default CallToAction;
