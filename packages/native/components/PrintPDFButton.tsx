import * as Print from 'expo-print';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SongsStackParamList } from '../navigation';
import { HeaderButton } from './HeaderButton';

type PDFViewerRouteProp = RouteProp<SongsStackParamList, 'PDFViewer'>;

export const PrintPDFButton = () => {
  const route = useRoute<PDFViewerRouteProp>();
  const { data } = route.params;
  return (
    <HeaderButton
      iconName="PrinterIcon"
      onPress={async () => {
        await Print.printAsync({
          uri: `data:application/pdf;base64,${data.base64}`,
        });
      }}
    />
  );
};
