import React from 'react';
import { connect } from 'react-redux';
import { Icon, Text, H1, Button } from 'native-base';
import { View } from 'react-native';
import AppNavigatorConfig from '../AppNavigatorConfig';

const BaseCallToAction = props => {
  return (
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
            color:
              AppNavigatorConfig.navigationOptions.headerStyle.backgroundColor,
            alignSelf: 'center'
          }}
        />
      </View>
      <H1 style={{ flex: 1, paddingTop: 20 }}>{props.title}</H1>
      <Text note style={{ flex: 3 }}>
        {props.text}
      </Text>
      <Button block full onPress={props.buttonHandler}>
        <Text>{props.buttonText}</Text>
      </Button>
    </View>
  );
};

export default BaseCallToAction;
