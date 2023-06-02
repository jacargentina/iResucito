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
        <Actionsheet.Backdrop />
        <Actionsheet.Content pb="$8">
          <Actionsheet.DragIndicatorWrapper>
            <Actionsheet.DragIndicator />
          </Actionsheet.DragIndicatorWrapper>
          <Actionsheet.Item
            onPress={() => {
              handleClose();
              shareList(listName, 'native');
            }}>
            <Actionsheet.ItemText>
              {i18n.t('list_export_options.native')}
            </Actionsheet.ItemText>
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              handleClose();
              shareList(listName, 'text');
            }}>
            <Actionsheet.ItemText>
              {i18n.t('list_export_options.plain text')}
            </Actionsheet.ItemText>
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={() => {
              handleClose();
              shareList(listName, 'pdf');
            }}>
            <Actionsheet.ItemText>
              {i18n.t('list_export_options.pdf file')}
            </Actionsheet.ItemText>
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
