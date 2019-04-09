// @flow
import React, { useContext } from 'react';
import Pdf from 'react-native-pdf';
import { withNavigation } from 'react-navigation';
import { Icon } from 'native-base';
import { View, Dimensions } from 'react-native';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import RNPrint from 'react-native-print';
import { DataContext } from '../DataContext';

const PDFViewer = (props: any) => {
  const { navigation } = props;
  return (
    <View
      style={{
        flex: 1
      }}>
      <Pdf
        source={{ uri: navigation.getParam('uri') }}
        scale={1.4}
        style={{
          flex: 1,
          width: Dimensions.get('window').width
        }}
      />
    </View>
  );
};

const Share = withNavigation(props => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const { sharePDF } = data;
  const song = navigation.getParam('song');
  const uri = navigation.getParam('uri');
  return (
    <Icon
      name="share"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => sharePDF(song, uri)}
    />
  );
});

const Print = withNavigation(props => {
  const { navigation } = props;
  const uri = navigation.getParam('uri');
  return (
    <Icon
      name="print"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => {
        RNPrint.print({ filePath: uri, isLandscape: true });
      }}
    />
  );
});

PDFViewer.navigationOptions = props => {
  const { navigation } = props;
  const { titulo } = navigation.getParam('song');
  return {
    title: `PDF - ${titulo}`,
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <Share />
        <Print />
      </View>
    )
  };
};

export default PDFViewer;
