import * as React from 'react';
import { useContext } from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import useStackNavOptions from '../navigation/useStackNavOptions';
import { DataContext } from '../DataContext';

const SharePDFButton = (props: any): React.Node => {
  const options = useStackNavOptions();
  const data = useContext(DataContext);
  const route = useRoute();
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
        color: options.headerTitleStyle.color,
      }}
      onPress={() => sharePDF(title, uri)}
    />
  );
};

export default SharePDFButton;
