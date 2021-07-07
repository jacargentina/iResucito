// @flow
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Actionsheet } from 'native-base';
import I18n from '../../translations';

const ChooseListTypeForAdd = (props: any): React.Node => {
  if (!props.disclose) {
    throw new Error('Se requiere props.disclose');
  }

  const { isOpen, onClose } = props.disclose;
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
        {/*<Actionsheet.Header>{I18n.t('ui.lists.type')}</Actionsheet.Header> */}
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
