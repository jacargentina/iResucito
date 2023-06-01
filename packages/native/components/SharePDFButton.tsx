import * as React from 'react';
import { Icon } from '../gluestack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { SongsStackParamList, useStackNavOptions } from '../navigation';
import { sharePDF } from '../hooks';
import { ShareIcon } from 'lucide-react-native';

type PDFViewerRouteProp = RouteProp<SongsStackParamList, 'PDFViewer'>;

export const SharePDFButton = () => {
  const options = useStackNavOptions();
  const route = useRoute<PDFViewerRouteProp>();
  const { title, uri } = route.params;
  return (
    <Icon
      as={ShareIcon}
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
