import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { Box, Icon, Text, Heading, Button } from '@gluestack-ui/themed';
import { GestureResponderEvent } from 'react-native';

export const CallToAction = (props: {
  icon: any;
  title: string;
  text: string;
  buttonHandler: (e: GestureResponderEvent) => void;
  buttonDisabled?: boolean;
  buttonText: string;
  children?: any;
}) => {
  useAndroidBackHandler(() => {
    return true;
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Box flex={1} p="$5">
        <Box
          flex={3}
          justifyContent="space-around"
          borderBottomWidth={1}
          borderBottomColor="$light200">
          <Icon
            as={props.icon}
            size='xxl'
            color="$primary500"
            style={{
              alignSelf: 'center',
            }}
          />
        </Box>
        {/*  @ts-ignore */}
        <Heading pt="$5">{props.title}</Heading>
        <Text testID="ca_text">{props.text}</Text>
        <Box flex={3} justifyContent="space-around">
          {props.children}
        </Box>
        <Box flex={2} justifyContent="space-around" mt="$4">
          <Button
            testID="ca_button"
            borderRadius={32}
            onPress={props.buttonHandler}
            isDisabled={props.buttonDisabled}>
            <Button.Text>{props.buttonText}</Button.Text>
          </Button>
        </Box>
      </Box>
    </KeyboardAwareScrollView>
  );
};
