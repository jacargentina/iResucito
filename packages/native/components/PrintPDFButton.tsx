import * as React from 'react';
import RNPrint from 'react-native-print';
import { Icon } from '../gluestack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SongsStackParamList, useStackNavOptions } from '../navigation';
import { PrinterIcon } from 'lucide-react-native';

type PDFViewerRouteProp = RouteProp<SongsStackParamList, 'PDFViewer'>;

export const PrintPDFButton = () => {
  const options = useStackNavOptions();
  const route = useRoute<PDFViewerRouteProp>();
  const { uri } = route.params;
  return (
    <Icon
      as={PrinterIcon}
      size="xl"
      style={{
        marginTop: 4,
        marginRight: 8,
      }}
      color={options.headerTitleStyle.color}
      onPress={() => {
        RNPrint.print({ filePath: uri, isLandscape: true });
      }}
    />
  );
};
