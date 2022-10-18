import * as React from 'react';
import { useState, useEffect } from 'react';
import { Input, Box, Button, FormControl } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLocalizedListType } from '@iresucito/core';
import { useData } from '../DataContext';
import ModalView from '../components/ModalView';
import I18n from '@iresucito/translations';

const ListNameDialog = (props: any) => {
  const data = useData();
  const navigation = useNavigation();
  const route = useRoute();
  const { lists, addList, renameList } = data.lists;
  const [disabledReasonText, setDisabledReasonText] = useState(null);
  const [actionEnabled, setActionEnabled] = useState(false);
  const [name, setName] = useState('');
  const { listName, action, type } = route.params;

  const runActionOnList = () => {
    if (action === 'create') {
      addList(name, type);
      navigation.navigate('ListDetail', { listName: name });
    } else if (action === 'rename') {
      renameList(listName, name);
      navigation.goBack(null);
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
          ? I18n.t('ui.lists.already exists')
          : I18n.t('ui.lists.non-empty name');
      setDisabledReasonText(text);
    } else {
      setDisabledReasonText(null);
    }
  }, [actionEnabled, name]);

  const title =
    action === 'create'
      ? `${I18n.t('ui.lists.create')} (${getLocalizedListType(
          type,
          data.localeReal
        )})`
      : `${I18n.t('ui.lists.rename')} (${listName})`;

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
          onPress={runActionOnList}
        >
          {action === 'create' ? I18n.t('ui.create') : I18n.t('ui.rename')}
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
          onPress={() => navigation.goBack(null)}
        >
          {I18n.t('ui.cancel')}
        </Button>
      }
    >
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
