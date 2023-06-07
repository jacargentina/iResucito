import * as React from 'react';
import { Button, Icon } from '../gluestack';
import { useStackNavOptions } from '../navigation';
import { GestureResponderEvent } from 'react-native';
import * as icons from 'lucide-react-native';

export const HeaderButton = (props: {
  testID?: string;
  iconName: string;
  onPress: (e: GestureResponderEvent) => void;
}) => {
  const options = useStackNavOptions();
  const { testID, iconName, onPress } = props;
  if (!icons[iconName]) {
    throw Error('No hay icono con nombre ' + iconName);
  }
  return (
    <Button onPress={onPress}>
      <Icon
        testID={testID}
        as={icons[iconName]}
        color={options.headerTitleStyle.color}
      />
    </Button>
  );
};
