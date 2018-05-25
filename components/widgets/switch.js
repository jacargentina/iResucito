// @flow
import React from 'react';
import { Platform } from 'react-native';
import { Switch as SwitchNB } from 'native-base';
import commonTheme from '../../native-base-theme/variables/platform';

const Switch = (props: any) => {
  var themeProps =
    Platform.OS == 'android'
      ? { thumbTintColor: commonTheme.brandPrimary, onTintColor: null }
      : { onTintColor: null };
  themeProps.onTintColor =
    Platform.OS == 'ios' ? commonTheme.brandPrimary : commonTheme.brandLight;
  return <SwitchNB {...props} {...themeProps} />;
};

export default Switch;
