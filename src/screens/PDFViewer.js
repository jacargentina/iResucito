// @flow
import React, { useContext, useState, useEffect } from 'react';
import Pdf from 'react-native-pdf';
import { Icon } from 'native-base';
import { View, Dimensions } from 'react-native';
import AppNavigatorOptions from '../AppNavigatorOptions';
import RNPrint from 'react-native-print';
import { DataContext } from '../DataContext';

const PDFViewer = (props: any) => {
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

const Share = props => {
  const data = useContext(DataContext);
  const { sharePDF } = data;
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => sharePDF(props.salmo, props.uri)}
    />
  );
};

const Print = props => {
  const printSong = uri => {
    RNPrint.print({ filePath: uri, isLandscape: true });
  };
  return (
    <Icon
      name="print"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: AppNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => printSong(props.uri)}
    />
  );
};

PDFViewer.navigationOptions = props => ({
  title: `PDF - ${props.navigation.state.params.salmo.titulo}`,
  headerRight: (
    <View style={{ flexDirection: 'row' }}>
      <Share {...props.navigation.state.params} />
      <Print {...props.navigation.state.params} />
    </View>
  )
});

export default PDFViewer;
