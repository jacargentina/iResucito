import * as React from 'react';
import { Button } from '../gluestack';
import { useStackNavOptions } from '../navigation';
import { GestureResponderEvent } from 'react-native';
import * as icons from 'lucide-react-native';

export const HeaderButton = (props: {
  testID?: string;
  iconName?: string;
  text?: string;
  textStyle?: any;
  onPress?: (e: GestureResponderEvent) => void;
}) => {
  const options = useStackNavOptions();
  const { testID, iconName, text, textStyle, onPress } = props;
  if (iconName && !icons[iconName]) {
    throw Error('No hay icono con nombre ' + iconName);
  }
  return (
    <Button testID={testID} onPress={onPress} borderWidth={0} px="$3">
      {iconName ? (
        <Button.Icon
          as={icons[iconName]}
          color={options.headerTitleStyle.color}
        />
      ) : (
        <Button.Text {...textStyle}>{text}</Button.Text>
      )}
    </Button>
  );
};
