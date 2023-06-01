import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Box, Text, HStack, Button, Center } from '../gluestack';
import { Platform, KeyboardAvoidingView } from 'react-native';
import i18n from '@iresucito/translations';

const ConditionalWrapper = (props: any) => {
  const { condition, wrapper, children } = props;
  return condition ? wrapper(children) : children;
};

export const ModalView = (props: any) => {
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
      variant="outline"
      mr="$2"
      style={{
        alignSelf: 'flex-end',
      }}
      onPress={() => {
        navigation.goBack();
        if (closeHandler) {
          closeHandler();
        }
      }}>
      <Button.Text>{closeText || i18n.t('ui.close')}</Button.Text>
    </Button>
  );

  return (
    <Box h="100%">
      <ConditionalWrapper
        condition={keyboardAvoidingView}
        wrapper={(childs: any) => (
          <KeyboardAvoidingView
            style={{ flexGrow: 1 }}
            behavior={Platform.OS === 'android' ? undefined : 'padding'}>
            {childs}
          </KeyboardAvoidingView>
        )}>
        <HStack my={2} justifyContent="space-between">
          <Box flex={1}>{left}</Box>
          {right || defaultClose}
        </HStack>
        {title && (
          <Center py="2">
            <Text fontWeight="bold">{title}</Text>
          </Center>
        )}
        <Box flex={1}>{children}</Box>
      </ConditionalWrapper>
    </Box>
  );
};
