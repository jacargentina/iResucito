import React from 'react';
import { Switch as SwitchNB } from 'native-base';
import commonTheme from '../../native-base-theme/variables/platform';

const Switch = props => {
  return <SwitchNB {...props} onTintColor={commonTheme.brandPrimary} />;
};

export default Switch;
