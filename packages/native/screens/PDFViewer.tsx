import { View, useWindowDimensions } from 'react-native';
import Pdf from 'react-native-pdf';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/RootNavigator';
import { SongDownloader, SongPlayer } from '../components';

type SongPreviewPdfRouteProp = RouteProp<RootStackParamList, 'SongPreviewPdf'>;

export const PDFViewer = () => {
  const route = useRoute<SongPreviewPdfRouteProp>();
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Pdf
        source={{ uri: route.params.data.uri }}
        style={{
          flex: 1,
          width: width,
        }}
      />
    </View>
  );
};
