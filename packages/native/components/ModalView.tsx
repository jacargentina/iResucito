import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Box, Text, HStack, Button, Center } from 'native-base';
import { Platform, KeyboardAvoidingView } from 'react-native';
import I18n from '@iresucito/translations';

const ConditionalWrapper = (props: any) => {
  const { condition, wrapper, children } = props;
  return condition ? wrapper(children) : children;
};

const ModalView = (props: any) => {
  const {
    left,
    right,
    title,
    children,
    closeText,
    closeHandler,
    keyboardAvoidingView = true,
  } = props;
  const navigation = useNavigation();
  const defaultClose = (
    <Button
      size="sm"
      variant="ghost"
      mr="2"
      style={{
        alignSelf: 'flex-end',
      }}
      onPress={() => {
        navigation.goBack(null);
        if (closeHandler) {
          closeHandler();
        }
      }}>
      {closeText || I18n.t('ui.close')}
    </Button>
  );

  return (
    <Box safeArea bg="white" h="100%">
      <ConditionalWrapper
        condition={keyboardAvoidingView}
        wrapper={(childs) => (
          <KeyboardAvoidingView
            style={{ flexGrow: 1 }}
            behavior={Platform.OS === 'android' ? null : 'padding'}>
            {childs}
          </KeyboardAvoidingView>
        )}>
        <HStack my={2} justifyContent="space-between">
          <Box flex={1}>{left}</Box>
          {right || defaultClose}
        </HStack>
        {title && (
          <Center py="2">
            <Text bold>{title}</Text>
          </Center>
        )}
        <Box flex={1}>{children}</Box>
      </ConditionalWrapper>
    </Box>
  );
};

export default ModalView;
