// @flow
import * as React from 'react';
import Pdf from 'react-native-pdf';
import { View, Dimensions } from 'react-native';

const SongViewPdf = (props: any): React.Node => {
  const { uri } = props;
  return (
    <View
      style={{
        flex: 1,
      }}>
      <Pdf
        source={{ uri }}
        scale={1.4}
        style={{
          flex: 1,
          width: Dimensions.get('window').width,
        }}
      />
    </View>
  );
};

export default SongViewPdf;
