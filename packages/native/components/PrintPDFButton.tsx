import * as React from 'react';
import RNPrint from 'react-native-print';
import { Icon } from 'native-base';
import { useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useStackNavOptions from '../navigation/useStackNavOptions';

const PrintPDFButton = (props: any): React.Node => {
  const options = useStackNavOptions();
  const route = useRoute();
  const { uri } = route.params;
  return (
    <Icon
      as={Ionicons}
      size="md"
      name="print-outline"
      style={{
        marginTop: 4,
        marginRight: 8,
        color: options.headerTitleStyle.color,
      }}
      onPress={() => {
        RNPrint.print({ filePath: uri, isLandscape: true });
      }}
    />
  );
};

export default PrintPDFButton;
