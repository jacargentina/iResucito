// @flow
import React from 'react';
import { Platform } from 'react-native';
import { Switch as SwitchNB } from 'native-base';
import commonTheme from '../native-base-theme/variables/platform';

const Switch = (props: any) => {
  var themeProps = {
    trackColor: {
      true: commonTheme.brandPrimary,
      false: commonTheme.brandLight
    },
    thumbColor: null
  };
  if (Platform.OS === 'android') {
    themeProps.thumbColor = commonTheme.brandPrimary;
  }
  return <SwitchNB {...props} {...themeProps} />;
};

export default Switch;
