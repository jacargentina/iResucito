import { useState, useEffect } from 'react';
import {
  Input,
  Box,
  Button,
  FormControl,
  InputField,
  useMedia,
} from '@gluestack-ui/themed';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { getLocalizedListType } from '@iresucito/core';
import { useListsStore } from '../hooks';
import { ModalView } from '../components';
import i18n from '@iresucito/translations';
import { StackNavigationProp } from '@react-navigation/stack';
import { ListsStackParamList, RootStackParamList } from '../navigation';

type ListNameDialogRouteProp = RouteProp<RootStackParamList, 'ListName'>;

type ListDetailNavivationProp = StackNavigationProp<
  ListsStackParamList,
  'ListDetail'
>;

export const ListNameDialog = () => {
  const media = useMedia();
  const navigation = useNavigation<ListDetailNavivationProp>();
  const route = useRoute<ListNameDialogRouteProp>();
  const { lists, add, rename } = useListsStore();
  const [disabledReasonText, setDisabledReasonText] = useState<string | null>(
    null
  );
  const [actionEnabled, setActionEnabled] = useState(false);
  const [name, setName] = useState('');
  const { listName, action, type } = route.params;

  const runActionOnList = () => {
    if (action === 'create' && type) {
      add(name, type);
      navigation.navigate('ListDetail', { listName: name });
    } else if (action === 'rename') {
      rename(listName, name);
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
          testID="list-name-button"
          borderRadius={16}
          size="sm"
          mr="$4"
          style={{
            alignSelf: 'flex-end',
          }}
          isDisabled={!actionEnabled}
          onPress={runActionOnList}>
          <Button.Text>
            {action === 'create' ? i18n.t('ui.create') : i18n.t('ui.rename')}
          </Button.Text>
        </Button>
      }
      left={
        <Button
          size="sm"
          variant="outline"
          ml="$2"
          style={{
            alignSelf: 'flex-start',
          }}
          onPress={() => navigation.goBack()}>
          <Button.Text>{i18n.t('ui.cancel')}</Button.Text>
        </Button>
      }>
      <Box p="$4">
        <FormControl mb="$5" isInvalid={!actionEnabled}>
          <Input width="100%" size={media.md ? 'xl' : undefined}>
            <InputField
              testID="list-name-input"
              autoFocus
              value={name}
              onChangeText={setName}
              clearButtonMode="always"
              autoCorrect={false}
              sx={{
                '@base': {
                  fontSize: undefined,
                  lineHeight: undefined,
                },
                '@md': {
                  fontSize: '$xl',
                  lineHeight: '$md',
                },
              }}
            />
          </Input>
          <FormControl.Error>
            <FormControl.Error.Text>
              {disabledReasonText}
            </FormControl.Error.Text>
          </FormControl.Error>
        </FormControl>
      </Box>
    </ModalView>
  );
};
