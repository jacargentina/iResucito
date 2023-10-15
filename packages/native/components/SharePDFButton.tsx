import { RouteProp, useRoute } from '@react-navigation/native';
import { SongsStackParamList } from '../navigation';
import { sharePDF } from '../hooks';
import { HeaderButton } from './HeaderButton';

type PDFViewerRouteProp = RouteProp<SongsStackParamList, 'PDFViewer'>;

export const SharePDFButton = () => {
  const route = useRoute<PDFViewerRouteProp>();
  const { title, data } = route.params;
  return (
    <HeaderButton
      iconName="ShareIcon"
      onPress={() => sharePDF(title, data.uri)}
    />
  );
};
