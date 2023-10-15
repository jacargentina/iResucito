import { View, Dimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

type SongPreviewPdfRouteProp = RouteProp<RootStackParamList, 'SongPreviewPdf'>;

export const PDFViewer = () => {
  const route = useRoute<SongPreviewPdfRouteProp>();
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Pdf
        source={{ uri: route.params.data.uri }}
        scale={1.4}
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
        }}
      />
    </View>
  );
};
