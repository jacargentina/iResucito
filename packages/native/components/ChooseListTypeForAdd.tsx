import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import {
  Text,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItemText,
  ActionsheetItem,
  useMedia,
} from '@gluestack-ui/themed';
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
  const media = useMedia();
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
      <ActionsheetBackdrop />
      <ActionsheetContent pb="$8">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <Text
          fontWeight="bold"
          lineHeight={media.md ? '$3xl' : undefined}
          fontSize={media.md ? '$2xl' : undefined}>
          {i18n.t('ui.lists.type')}
        </Text>
        <ActionsheetItem
          onPress={() => nav('eucaristia')}
          testID="list_type.eucharist">
          <ActionsheetItemText
            fontSize={media.md ? '$2xl' : undefined}
            lineHeight={media.md ? '$3xl' : undefined}>
            {i18n.t('list_type.eucharist')}
          </ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem onPress={() => nav('palabra')} testID="list_type.word">
          <ActionsheetItemText
            fontSize={media.md ? '$2xl' : undefined}
            lineHeight={media.md ? '$3xl' : undefined}>
            {i18n.t('list_type.word')}
          </ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem onPress={() => nav('libre')} testID="list_type.other">
          <ActionsheetItemText
            fontSize={media.md ? '$2xl' : undefined}
            lineHeight={media.md ? '$3xl' : undefined}>
            {i18n.t('list_type.other')}
          </ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
};
