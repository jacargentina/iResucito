// @flow
import React from 'react';
import { Platform } from 'react-native';
import { Switch as SwitchNB } from 'native-base';
import color from 'color';
import commonTheme from '../native-base-theme/variables/platform';

const Switch = (props: any) => {
  var themeProps = {
    trackColor: {
      true: color(commonTheme.brandPrimary).lighten(0.3).string(),
      false: commonTheme.brandLight,
    },
    thumbColor: undefined,
  };
  if (Platform.OS === 'android') {
    themeProps.thumbColor = props.value
      ? commonTheme.brandPrimary
      : color(commonTheme.brandLight).darken(0.1).string();
  }
  return <SwitchNB {...props} {...themeProps} />;
};

export default Switch;
