// @flow
import React from 'react';
import { Platform } from 'react-native';
import { Switch as SwitchNB } from 'native-base';
import commonTheme from '../../native-base-theme/variables/platform';

const Switch = (props: any) => {
  var themeProps = {
    onTintColor: Platform.OS == 'ios' ? commonTheme.brandPrimary : commonTheme.brandLight,
    thumbTintColor: ''
  };
  if (Platform.OS == 'android') {
    themeProps.thumbTintColor = commonTheme.brandPrimary;
  }
  return <SwitchNB {...props} {...themeProps} />;
};

export default Switch;
