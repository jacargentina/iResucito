// @flow
import React, { useContext } from 'react';
import { withNavigation } from 'react-navigation';
import { Icon } from 'native-base';
import { View } from 'react-native';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import RNPrint from 'react-native-print';
import { DataContext } from '../DataContext';
import SongViewPdf from './SongViewPdf';

const PDFViewer = (props: any) => {
  const { navigation } = props;
  return <SongViewPdf uri={navigation.getParam('uri')} />;
};

const Share = withNavigation(props => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const { sharePDF } = data;
  const title = navigation.getParam('title');
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
      onPress={() => sharePDF(title, uri)}
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
  const title = navigation.getParam('title');
  return {
    title: `PDF - ${title}`,
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <Share />
        <Print />
      </View>
    )
  };
};

export default PDFViewer;
