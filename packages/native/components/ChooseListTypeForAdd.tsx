import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Text, Actionsheet } from '../gluestack';
import i18n from '@iresucito/translations';
import { RootStackParamList } from '../navigation';
import { ListType } from '@iresucito/core';

type ListNameScreenNavigationProp = BottomTabNavigationProp<
  RootStackParamList,
  'ListName'
>;

export const ChooseListTypeForAdd = (props: {
  isOpen: boolean;
  onClose: () => any;
}) => {
  const { isOpen, onClose } = props;
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
      <Actionsheet.Backdrop />
      <Actionsheet.Content>
        <Actionsheet.DragIndicatorWrapper>
          <Actionsheet.DragIndicator />
        </Actionsheet.DragIndicatorWrapper>
        <Text fontWeight="bold">{i18n.t('ui.lists.type')}</Text>
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
