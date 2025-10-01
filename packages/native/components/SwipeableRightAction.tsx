import { useMedia } from '@gluestack-style/react';
import { ColorValue, I18nManager, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface RightActionProps {
  text: string;
  color: ColorValue | undefined;
  x: number;
  progress: SharedValue<number>;
  swipeableRef: React.RefObject<SwipeableMethods | null>;
  onPress: any;
  enabled?: boolean;
}

export const SwipeableStyles = StyleSheet.create({
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  rightActionView: {
    flex: 1,
  },
  rightActionsView: {
    width: 192,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
});

export const SwipeableRightAction = ({
  text,
  color,
  x,
  progress,
  swipeableRef,
  onPress,
  enabled,
}: RightActionProps) => {
  const media = useMedia();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: interpolate(progress.value, [0, 1], [x, 0]) }],
    };
  });
  const pressHandler = () => {
    swipeableRef.current?.close();
    onPress();
  };
  return (
    <Reanimated.View style={[SwipeableStyles.rightActionView, animatedStyle]}>
      <RectButton
        style={[SwipeableStyles.rightAction, { backgroundColor: color }]}
        enabled={enabled}
        onPress={pressHandler}>
        <Text
          style={[SwipeableStyles.actionText, { fontSize: media.md ? 20 : undefined }]}>
          {text}
        </Text>
      </RectButton>
    </Reanimated.View>
  );
};
