// @flow
import React from 'react';
import { connect } from 'react-redux';
import Pdf from 'react-native-pdf';
import { Icon } from 'native-base';
import { View, Dimensions } from 'react-native';
import AppNavigatorOptions from '../AppNavigatorOptions';
import RNPrint from 'react-native-print';
import { sharePDF } from '../actions';

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

const mapDispatchToProps = dispatch => {
  return {
    printSong: uri => {
      RNPrint.print({ filePath: uri, isLandscape: true });
    },
    shareSong: (salmo, uri) => {
      dispatch(sharePDF(salmo, uri));
    }
  };
};

const Share = props => {
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
      onPress={() => props.shareSong(props.salmo, props.uri)}
    />
  );
};

const ShareButton = connect(null, mapDispatchToProps)(Share);

const Print = props => {
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
      onPress={() => props.printSong(props.uri)}
    />
  );
};

const PrintButton = connect(null, mapDispatchToProps)(Print);

PDFViewer.navigationOptions = props => ({
  title: `PDF - ${props.navigation.state.params.salmo.titulo}`,
  headerRight: (
    <View style={{ flexDirection: 'row' }}>
      <ShareButton {...props.navigation.state.params} />
      <PrintButton {...props.navigation.state.params} />
    </View>
  )
});

export default PDFViewer;
