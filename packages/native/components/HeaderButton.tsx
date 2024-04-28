import { Button, ButtonIcon, ButtonText, useMedia } from '@gluestack-ui/themed';
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
  const media = useMedia();
  const options = useStackNavOptions();
  const { testID, iconName, text, textStyle, onPress } = props;
  if (iconName && !icons[iconName]) {
    throw Error('No hay icono con nombre ' + iconName);
  }
  return (
    <Button
      testID={testID}
      onPress={onPress}
      borderWidth={0}
      px="$3"
      bg="transparent">
      {iconName ? (
        <ButtonIcon
          as={icons[iconName]}
          // @ts-ignore
          size={media.md ? 30 : undefined}
          // @ts-ignore
          color={options.headerTitleStyle.color}
        />
      ) : (
        <ButtonText {...textStyle}>{text}</ButtonText>
      )}
    </Button>
  );
};
