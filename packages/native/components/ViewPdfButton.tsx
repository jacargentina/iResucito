import * as React from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import I18n from '@iresucito/translations';
import { defaultExportToPdfOptions } from  '@iresucito/core';
import { NativeParser } from '../util';
import { generateSongPDF } from '../pdf';
import useStackNavOptions from '../navigation/useStackNavOptions';

const ViewPdfButton = (props: any): React.Node => {
  const options = useStackNavOptions();
  const navigation = useNavigation();
  const route = useRoute();
  const { song } = route.params;
  if (!song) {
    return null;
  }

  return (
    <Icon
      as={Ionicons}
      name="document-text-outline"
      size="md"
      style={{
        marginTop: 4,
        marginRight: 8,
        color: options.headerTitleStyle.color,
      }}
      onPress={() => {
        const { fullText } = song;
        const render = NativeParser.getForRender(
          fullText,
          I18n.locale,
          song.transportTo
        );
        const item: SongToPdf = {
          song,
          render,
        };
        var exportOptions = Object.assign({}, defaultExportToPdfOptions, {
          disablePageNumbers: true,
        });
        generateSongPDF([item], exportOptions, '').then((path) => {
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
