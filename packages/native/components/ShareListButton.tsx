import * as React from 'react';
import { Keyboard } from 'react-native';
import { Icon, Actionsheet, useDisclose } from 'native-base';
import { RouteProp, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useData } from '../DataContext';
import useStackNavOptions from '../navigation/StackNavOptions';
import I18n from '@iresucito/translations';
import { ListsStackParamList } from '../navigation/ListsNavigator';

type ListDetailRouteProp = RouteProp<ListsStackParamList, 'ListDetail'>;

const ShareListButton = () => {
  const options = useStackNavOptions();
  const { isOpen, onClose, onOpen } = useDisclose();
  const route = useRoute<ListDetailRouteProp>();
  const { listName } = route.params;
  const data = useData();
  const { shareList } = data.lists;

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              onClose();
              shareList(listName, I18n.locale, 'native');
            }}>
            {I18n.t('list_export_options.native')}
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              onClose();
              shareList(listName, I18n.locale, 'text');
            }}>
            {I18n.t('list_export_options.plain text')}
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              onClose();
              shareList(listName, I18n.locale, 'pdf');
            }}>
            {I18n.t('list_export_options.pdf file')}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      <Icon
        as={Ionicons}
        name="share-outline"
        size="md"
        style={{
          marginTop: 4,
          marginRight: 12,
        }}
        color={options.headerTitleStyle.color}
        onPress={() => {
          Keyboard.dismiss();
          onOpen();
        }}
      />
    </>
  );
};

export default ShareListButton;
