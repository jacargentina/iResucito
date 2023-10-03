
import RNPrint from 'react-native-print';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SongsStackParamList } from '../navigation';
import { HeaderButton } from './HeaderButton';

type PDFViewerRouteProp = RouteProp<SongsStackParamList, 'PDFViewer'>;

export const PrintPDFButton = () => {
  const route = useRoute<PDFViewerRouteProp>();
  const { uri } = route.params;
  return (
    <HeaderButton
      iconName="PrinterIcon"
      onPress={() => {
        RNPrint.print({ filePath: uri, isLandscape: true });
      }}
    />
  );
};
