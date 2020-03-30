// @flow
import React from 'react';
import { Icon } from 'native-base';
import { defaultExportToPdfOptions } from '../../common';
import { NativeParser } from '../util';
import { generatePDF } from '../pdf';
import { useNavigation, useRoute } from '@react-navigation/native';
import I18n from '../../translations';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';

const ViewPdfButton = (props: any) => {
  const navigation = useNavigation();
  const route = useRoute();
  const { song, transportToNote } = route.params;
  if (!song) {
    return null;
  }

  return (
    <Icon
      name="paper"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions().headerTitleStyle.color,
      }}
      onPress={() => {
        const { fullText } = song;
        const render = NativeParser.getForRender(
          fullText,
          I18n.locale,
          transportToNote
        );
        const item: SongToPdf = {
          song,
          render,
        };
        var options = Object.assign({}, defaultExportToPdfOptions, {
          disablePageNumbers: true,
        });
        generatePDF([item], options, '').then((path) => {
          navigation.navigate('PDFViewer', {
            uri: path,
            title: song.titulo,
          });
        });
      }}
    />
  );
};

export default ViewPdfButton;
