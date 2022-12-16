import * as React from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useRoute } from '@react-navigation/native';
import useStackNavOptions from '../navigation/StackNavOptions';
import { useData } from '../DataContext';
import { SongsStackParamList } from '../navigation/SongsNavigator';

type PDFViewerRouteProp = RouteProp<SongsStackParamList, 'PDFViewer'>;

const SharePDFButton = () => {
  const options = useStackNavOptions();
  const data = useData();
  const route = useRoute<PDFViewerRouteProp>();
  const { sharePDF } = data;
  const { title, uri } = route.params;
  return (
    <Icon
      as={Ionicons}
      name="share-outline"
      size="md"
      style={{
        marginTop: 4,
        marginRight: 8,
      }}
      color={options.headerTitleStyle.color}
      onPress={() => sharePDF(title, uri)}
    />
  );
};

export default SharePDFButton;
