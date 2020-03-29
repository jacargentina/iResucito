// @flow
import React from 'react';
import { Icon } from 'native-base';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import RNPrint from 'react-native-print';

const PrintPDFButton = (props: any) => {
  const { route } = props;
  const { uri } = route.params;
  return (
    <Icon
      name="print"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions().headerTitleStyle.color
      }}
      onPress={() => {
        RNPrint.print({ filePath: uri, isLandscape: true });
      }}
    />
  );
};

export default PrintPDFButton;
