// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Icon, Actionsheet, useDisclose } from 'native-base';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DataContext } from '../DataContext';
import useStackNavOptions from '../navigation/useStackNavOptions';
import I18n from '../../translations';

const ShareListButton = (props: any): React.Node => {
  const options = useStackNavOptions();
  const { isOpen, onClose, onOpen } = useDisclose();
  const route = useRoute();
  const { listName } = route.params;
  const data = useContext(DataContext);
  const { shareList } = data.lists;

  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              onClose();
              shareList(listName, data.localeReal, 'native');
            }}>
            {I18n.t('list_export_options.native')}
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              onClose();
              shareList(listName, data.localeReal, 'text');
            }}>
            {I18n.t('list_export_options.plain text')}
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              onClose();
              shareList(listName, data.localeReal, 'pdf');
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
          color: options.headerTitleStyle.color,
        }}
        onPress={onOpen}
      />
    </>
  );
};

export default ShareListButton;
