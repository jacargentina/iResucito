import * as React from 'react';
import { Icon } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import i18n from '@iresucito/translations';
import { defaultExportToPdfOptions, ExportToPdfOptions, SongToPdf } from '@iresucito/core';
import { NativeParser } from '../util';
import { generateSongPDF } from '../pdf';
import useStackNavOptions from '../navigation/StackNavOptions';

import type { SongsStackParamList } from '../navigation/SongsNavigator';
import type { ListsStackParamList } from '../navigation/ListsNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type SongDetailRouteProp1 = RouteProp<SongsStackParamList, 'SongDetail'>;
type SongDetailRouteProp2 = RouteProp<ListsStackParamList, 'SongDetail'>;

type PDFViewerScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'PDFViewer'
>;

const ViewPdfButton = () => {
  const options = useStackNavOptions();
  const navigation = useNavigation<PDFViewerScreenNavigationProp>();
  const route = useRoute<SongDetailRouteProp1 | SongDetailRouteProp2>();
  const { song } = route.params;
  if (!song) {
    return null;
  }

  return (
    <Icon
      as={Ionicons}
      name="document-text-outline"
      size="xl"
      style={{
        marginTop: 4,
        marginRight: 8,
      }}
      color={options.headerTitleStyle.color}
      onPress={async () => {
        const { fullText } = song;
        const render = NativeParser.getForRender(
          fullText,
          i18n.locale,
          song.transportTo
        );
        const item: SongToPdf = {
          song,
          render,
        };
        var exportOpts: ExportToPdfOptions = {
          ...defaultExportToPdfOptions,
          disablePageNumbers: true,
        };
        const path = await generateSongPDF([item], exportOpts, item.song.titulo, false);
        navigation.navigate('PDFViewer', {
          uri: path,
          title: song.titulo,
        });
      }}
    />
  );
};

export default ViewPdfButton;
