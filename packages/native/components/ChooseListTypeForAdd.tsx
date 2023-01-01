import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Text, Actionsheet } from 'native-base';
import i18n from '@iresucito/translations';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { ListType } from '../types';

type ListNameScreenNavigationProp = BottomTabNavigationProp<
  RootStackParamList,
  'ListName'
>;

const ChooseListTypeForAdd = (props: any) => {
  const { isOpen, onClose } = props.chooser;
  const navigation = useNavigation<ListNameScreenNavigationProp>();

  const nav = (type: ListType) => {
    navigation.navigate('ListName', {
      listName: '',
      action: 'create',
      type: type,
    });
    onClose();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Text bold>{i18n.t('ui.lists.type')}</Text>
        <Actionsheet.Item onPress={() => nav('eucaristia')}>
          {i18n.t('list_type.eucharist')}
        </Actionsheet.Item>
        <Actionsheet.Item onPress={() => nav('palabra')}>
          {i18n.t('list_type.word')}
        </Actionsheet.Item>
        <Actionsheet.Item onPress={() => nav('libre')}>
          {i18n.t('list_type.other')}
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ChooseListTypeForAdd;
