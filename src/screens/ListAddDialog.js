// @flow
import React, { useContext, useState, useEffect } from 'react';
import { Text, Input, Item, Button, View } from 'native-base';
import { DataContext } from '../DataContext';
import BaseModal from './BaseModal';
import { getFriendlyTextForListType } from '../util';
import I18n from '../translations';

const ListAddDialog = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const { lists, addList, save } = data.lists;
  const [disabledReasonText, setDisabledReasonText] = useState(null);
  const [listCreateEnabled, setListCreateEnabled] = useState(false);
  const [listCreateName, setListCreateName] = useState('');

  const listCreateType = navigation.getParam('type');

  const createNewList = (name, type) => {
    addList(name, type);
    save();
    const onCreated = navigation.getParam('onCreated');
    if (onCreated) {
      onCreated(name);
    }
  };

  useEffect(() => {
    if (listCreateName) {
      var candidateName = listCreateName.trim();
      var listNames = Object.keys(lists);
      var result = candidateName !== '' && !listNames.includes(candidateName);
      setListCreateEnabled(result);
    } else {
      setListCreateEnabled(false);
    }
  }, [listCreateName]);

  useEffect(() => {
    if (!listCreateEnabled) {
      var text =
        listCreateName && listCreateName.trim() !== ''
          ? I18n.t('ui.lists.already exists')
          : I18n.t('ui.lists.non-empty name');
      setDisabledReasonText(text);
    } else {
      setDisabledReasonText(null);
    }
  }, [listCreateEnabled, listCreateName]);

  var acceptButtons = (
    <Button
      style={{ marginRight: 10, marginBottom: 10 }}
      primary
      onPress={() => createNewList(listCreateName, listCreateType)}
      disabled={!listCreateEnabled}>
      <Text>{I18n.t('ui.create')}</Text>
    </Button>
  );
  var titleSuffix = getFriendlyTextForListType(listCreateType);
  return (
    <BaseModal
      acceptButtons={acceptButtons}
      title={`${I18n.t('ui.lists.create')} (${titleSuffix})`}>
      <View style={{ padding: 10 }}>
        <Item
          style={{ marginBottom: 20 }}
          error={!listCreateEnabled}
          success={listCreateEnabled}>
          <Input
            autoFocus
            onChangeText={setListCreateName}
            value={listCreateName}
            clearButtonMode="always"
            autoCorrect={false}
          />
        </Item>
        <Text danger note>
          {disabledReasonText}
        </Text>
      </View>
    </BaseModal>
  );
};

export default ListAddDialog;
