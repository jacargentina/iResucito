// @flow
import * as React from 'react';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import { Box, Icon, Text, Heading, Button } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CallToAction = (props: any): React.Node => {
  return (
    <AndroidBackHandler onBackPress={() => true}>
      <Box flex={1} p="5">
        <Box
          flex={3}
          justifyContent="space-around"
          borderBottomWidth={1}
          borderBottomColor="#ccc">
          <Icon
            as={Ionicons}
            name={props.icon}
            size={32}
            color="rose.500"
            style={{
              alignSelf: 'center',
            }}
          />
        </Box>
        <Heading pt="5">{props.title}</Heading>
        <Text testID="ca_text">{props.text}</Text>
        <Box flex={3} justifyContent="space-around">
          {props.children}
        </Box>
        <Box flex={2} justifyContent="space-around" mt="4">
          <Button
            testID="ca_button"
            colorScheme="rose"
            _text={{ color: 'white' }}
            borderRadius="pill"
            onPress={props.buttonHandler}
            disabled={props.buttonDisabled}>
            {props.buttonText}
          </Button>
        </Box>
      </Box>
    </AndroidBackHandler>
  );
};

export default CallToAction;
