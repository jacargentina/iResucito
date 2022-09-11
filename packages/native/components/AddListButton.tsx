import * as React from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useStackNavOptions from '../navigation/useStackNavOptions';

const AddListButton = (props: any): React.Node => {
  const { onPress } = props;
  const options = useStackNavOptions();
  return (
    <Icon
      as={Ionicons}
      name="add"
      size="md"
      style={{
        marginTop: 4,
        marginRight: 8,
        color: options.headerTitleStyle.color,
      }}
      onPress={onPress}
    />
  );
};

export default AddListButton;
