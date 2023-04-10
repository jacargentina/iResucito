import * as React from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useRoute } from '@react-navigation/native';
import useStackNavOptions from '../navigation/StackNavOptions';
import { sharePDF } from '../hooks';
import { SongsStackParamList } from '../navigation/SongsNavigator';

type PDFViewerRouteProp = RouteProp<SongsStackParamList, 'PDFViewer'>;

const SharePDFButton = () => {
  const options = useStackNavOptions();
  const route = useRoute<PDFViewerRouteProp>();
  const { title, uri } = route.params;
  return (
    <Icon
      as={Ionicons}
      name="share-outline"
      size="xl"
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
