import * as React from 'react';
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

const SwipeableRightAction = (props: {
  text: string;
  color: string;
  x: number;
  progress: any;
  onPress: any;
}) => {
  const { text, color, x, progress, onPress } = props;
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [x, 0],
  });

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
      <RectButton
        style={[styles.rightAction, { backgroundColor: color }]}
        onPress={onPress}>
        <Text style={styles.actionText}>{text}</Text>
      </RectButton>
    </Animated.View>
  );
};

export default SwipeableRightAction;
