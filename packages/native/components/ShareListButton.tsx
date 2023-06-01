import * as React from 'react';
import { Keyboard } from 'react-native';
import { Icon, Actionsheet } from '../gluestack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useListsStore } from '../hooks';
import { useStackNavOptions, ListsStackParamList } from '../navigation';
import i18n from '@iresucito/translations';
import { ShareIcon } from 'lucide-react-native';

type ListDetailRouteProp = RouteProp<ListsStackParamList, 'ListDetail'>;

export const ShareListButton = () => {
  const options = useStackNavOptions();
  const [showActionsheet, setShowActionsheet] = React.useState(false);
  const handleClose = () => setShowActionsheet(!showActionsheet);
  const route = useRoute<ListDetailRouteProp>();
  const { listName } = route.params;
  const { shareList } = useListsStore();

  return (
    <>
      <Actionsheet isOpen={showActionsheet} onClose={handleClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            onPress={() => {
              handleClose();
              shareList(listName, 'native');
            }}>
            {i18n.t('list_export_options.native')}
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              handleClose();
              shareList(listName, 'text');
            }}>
            {i18n.t('list_export_options.plain text')}
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              handleClose();
              shareList(listName, 'pdf');
            }}>
            {i18n.t('list_export_options.pdf file')}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
      <Icon
        as={ShareIcon}
        size="xl"
        style={{
          marginTop: 4,
          marginRight: 12,
        }}
        color={options.headerTitleStyle.color}
        onPress={() => {
          Keyboard.dismiss();
          setShowActionsheet(true);
        }}
      />
    </>
  );
};
