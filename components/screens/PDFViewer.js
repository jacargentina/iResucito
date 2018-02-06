import React from 'react';
import Pdf from 'react-native-pdf';
import { View, Dimensions } from 'react-native';

const PDFViewer = props => {
  return (
    <View
      style={{
        flex: 1
      }}>
      <Pdf
        source={{ uri: props.navigation.state.params.uri }}
        scale={1.4}
        style={{
          flex: 1,
          width: Dimensions.get('window').width
        }}
      />
    </View>
  );
};

PDFViewer.navigationOptions = props => ({
  title: props.navigation.state.params.title
});

export default PDFViewer;
