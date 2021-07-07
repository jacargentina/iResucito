// @flow
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Box, Text, HStack, Button, Center } from 'native-base';
import { Platform, KeyboardAvoidingView } from 'react-native';
import I18n from '../../translations';

const ModalView = (props: any): React.Node => {
  const { left, right, title, children, closeText, closeHandler } = props;
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
      <KeyboardAvoidingView
        style={{ flexGrow: 1 }}
        behavior={Platform.OS === 'android' ? null : 'padding'}>
        <HStack justifyContent="space-between">
          <Box flex={1}>{left}</Box>
          {right || defaultClose}
        </HStack>
        {title && (
          <Center py="2">
            <Text bold>{title}</Text>
          </Center>
        )}
        <Box flex={1}>{children}</Box>
      </KeyboardAvoidingView>
    </Box>
  );
};

export default ModalView;
