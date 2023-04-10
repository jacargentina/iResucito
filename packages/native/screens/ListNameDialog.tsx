import * as React from 'react';
import { useState, useEffect } from 'react';
import { Input, Box, Button, FormControl } from 'native-base';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { getLocalizedListType } from '@iresucito/core';
import { useLists } from '../hooks';
import ModalView from '../components/ModalView';
import i18n from '@iresucito/translations';

import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { ListsStackParamList } from '../navigation/ListsNavigator';

type ListNameDialogRouteProp = RouteProp<RootStackParamList, 'ListName'>;

type ListDetailNavivationProp = StackNavigationProp<
  ListsStackParamList,
  'ListDetail'
>;

const ListNameDialog = () => {
  const { lists, addList, renameList } =  useLists();
  const navigation = useNavigation<ListDetailNavivationProp>();
  const route = useRoute<ListNameDialogRouteProp>();
  const [disabledReasonText, setDisabledReasonText] = useState<string | null>(
    null
  );
  const [actionEnabled, setActionEnabled] = useState(false);
  const [name, setName] = useState('');
  const { listName, action, type } = route.params;

  const runActionOnList = () => {
    if (action === 'create' && type) {
      addList(name, type);
      navigation.navigate('ListDetail', { listName: name });
    } else if (action === 'rename') {
      renameList(listName, name);
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (name) {
      var candidateName = name.trim();
      var listNames = Object.keys(lists);
      var result = candidateName !== '' && !listNames.includes(candidateName);
      setActionEnabled(result);
    } else {
      setActionEnabled(false);
    }
  }, [name, lists]);

  useEffect(() => {
    if (!actionEnabled) {
      var text =
        name && name.trim() !== ''
          ? i18n.t('ui.lists.already exists')
          : i18n.t('ui.lists.non-empty name');
      setDisabledReasonText(text);
    } else {
      setDisabledReasonText(null);
    }
  }, [actionEnabled, name]);

  const title =
    action === 'create' && type
      ? `${i18n.t('ui.lists.create')} (${getLocalizedListType(
          type,
          i18n.locale
        )})`
      : `${i18n.t('ui.lists.rename')} (${listName})`;

  return (
    <ModalView
      title={title}
      right={
        <Button
          borderRadius={16}
          size="sm"
          mr="4"
          style={{
            alignSelf: 'flex-end',
          }}
          isDisabled={!actionEnabled}
          onPress={runActionOnList}>
          {action === 'create' ? i18n.t('ui.create') : i18n.t('ui.rename')}
        </Button>
      }
      left={
        <Button
          size="sm"
          variant="ghost"
          ml="2"
          style={{
            alignSelf: 'flex-start',
          }}
          onPress={() => navigation.goBack()}>
          {i18n.t('ui.cancel')}
        </Button>
      }>
      <Box px="5">
        <FormControl mb="5" isInvalid={!actionEnabled}>
          <Input
            size="lg"
            autoFocus
            onChangeText={setName}
            value={name}
            clearButtonMode="always"
            autoCorrect={false}
          />
          <FormControl.ErrorMessage>
            {disabledReasonText}
          </FormControl.ErrorMessage>
        </FormControl>
      </Box>
    </ModalView>
  );
};

export default ListNameDialog;
