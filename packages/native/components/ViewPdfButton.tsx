import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import i18n from '@iresucito/translations';
import {
  defaultExportToPdfOptions,
  ExportToPdfOptions,
  SongToPdf,
} from '@iresucito/core';
import { NativeParser } from '../util';
import { generateSongPDF } from '../pdf';
import { SongsStackParamList, ListsStackParamList } from '../navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { HeaderButton } from './HeaderButton';

type SongDetailRouteProp1 = RouteProp<SongsStackParamList, 'SongDetail'>;
type SongDetailRouteProp2 = RouteProp<ListsStackParamList, 'SongDetail'>;

type PDFViewerScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'PDFViewer'
>;

export const ViewPdfButton = () => {
  const navigation = useNavigation<PDFViewerScreenNavigationProp>();
  const route = useRoute<SongDetailRouteProp1 | SongDetailRouteProp2>();
  const { song } = route.params;
  if (!song) {
    return null;
  }

  return (
    <HeaderButton
      testID="view-pdf-button"
      iconName="FileTextIcon"
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
        const result = await generateSongPDF(
          [item],
          exportOpts,
          item.song.titulo,
          false
        );
        navigation.navigate('PDFViewer', {
          data: result,
          title: song.titulo,
        });
      }}
    />
  );
};
