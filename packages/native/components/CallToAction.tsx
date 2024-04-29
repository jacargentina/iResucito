import { useAndroidBackHandler } from 'react-navigation-backhandler';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import {
  Box,
  Icon,
  Text,
  Heading,
  Button,
  useMedia,
  ButtonText,
} from '@gluestack-ui/themed';
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
  const media = useMedia();

  useAndroidBackHandler(() => {
    return true;
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <Box flex={1} p={media.md ? '$16' : '$5'}>
        <Box
          flex={3}
          justifyContent="space-around"
          borderBottomWidth={1}
          $dark-borderBottomColor="$light500"
          $light-borderBottomColor="$light200">
          <Icon
            as={props.icon}
            // @ts-ignore
            size={media.md ? 100 : 'xxl'}
            color="$primary500"
            style={{
              alignSelf: 'center',
            }}
          />
        </Box>
        <Heading
          pt="$5"
          fontSize={media.md ? 32 : undefined}
          lineHeight={media.md ? 38 : undefined}>
          {props.title}
        </Heading>
        <Text
          testID="ca_text"
          fontSize={media.md ? 22 : undefined}
          lineHeight={media.md ? 26 : undefined}>
          {props.text}
        </Text>
        <Box flex={3} justifyContent="space-around">
          {props.children}
        </Box>
        <Box flex={2} justifyContent="space-around" mt="$4">
          <Button
            testID="ca_button"
            borderRadius={32}
            onPress={props.buttonHandler}
            isDisabled={props.buttonDisabled}
            alignSelf="center"
            w={media.md ? '85%' : undefined}
            size={media.md ? 'xl' : undefined}
            bg="$primary500">
            <ButtonText>{props.buttonText}</ButtonText>
          </Button>
        </Box>
      </Box>
    </KeyboardAwareScrollView>
  );
};
