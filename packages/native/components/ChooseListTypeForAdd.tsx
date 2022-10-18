import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, Actionsheet } from 'native-base';
import I18n from '@iresucito/translations';

const ChooseListTypeForAdd = (props: any) => {
  const { isOpen, onClose } = props.chooser;
  const navigation = useNavigation();

  const nav = (type: string) => {
    navigation.navigate('ListName', {
      action: 'create',
      type: type,
    });
    onClose();
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Text bold>{I18n.t('ui.lists.type')}</Text>
        <Actionsheet.Item onPress={() => nav('eucaristia')}>
          {I18n.t('list_type.eucharist')}
        </Actionsheet.Item>
        <Actionsheet.Item onPress={() => nav('palabra')}>
          {I18n.t('list_type.word')}
        </Actionsheet.Item>
        <Actionsheet.Item onPress={() => nav('libre')}>
          {I18n.t('list_type.other')}
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ChooseListTypeForAdd;
