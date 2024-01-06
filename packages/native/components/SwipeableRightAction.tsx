import { useMedia } from '@gluestack-style/react';
import { Animated, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
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
});

export const SwipeableRightAction = (props: {
  text: string;
  color: string;
  x: number;
  progress: any;
  onPress: any;
  enabled?: boolean;
}) => {
  const media = useMedia();
  const { text, color, x, progress, onPress, enabled } = props;
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [x, 0],
  });

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
      <RectButton
        style={[styles.rightAction, { backgroundColor: color }]}
        enabled={enabled}
        onPress={onPress}>
        <Text
          style={[styles.actionText, { fontSize: media.md ? 20 : undefined }]}>
          {text}
        </Text>
      </RectButton>
    </Animated.View>
  );
};
