import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import i18n from '@iresucito/translations';
import { PdfStyles, SongsParser } from '@iresucito/core';
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
        const parser = new SongsParser(PdfStyles);
        const render = parser.getForRender(
          fullText,
          i18n.locale,
          song.transportTo
        );
        const result = await generateSongPDF(
          [
            {
              song,
              render,
            },
          ],
          {
            ...PdfStyles,
            disablePageNumbers: true,
          },
          song.titulo,
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
