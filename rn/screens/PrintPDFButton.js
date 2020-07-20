// @flow
import React from 'react';
import { Icon } from 'native-base';
import { useRoute } from '@react-navigation/native';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import RNPrint from 'react-native-print';

const PrintPDFButton = (props: any) => {
  const route = useRoute();
  const { uri } = route.params;
  return (
    <Icon
      name="print"
      type="FontAwesome"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions().headerTitleStyle.color,
      }}
      onPress={() => {
        RNPrint.print({ filePath: uri, isLandscape: true });
      }}
    />
  );
};

export default PrintPDFButton;
