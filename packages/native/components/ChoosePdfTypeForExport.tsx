import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Text,
  Actionsheet,
  ActionsheetItemText,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  useMedia,
} from '@gluestack-ui/themed';
import i18n from '@iresucito/translations';
import { PdfStyle, PdfStyles, SongToPdf, SongsParser } from '@iresucito/core';
import { generateSongPDF } from '../pdf';
import { SongsStackParamList } from '../navigation/SongsNavigator';
import { useSongsStore, useSongsSelection } from '../hooks';

type PDFViewerScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'PDFViewer'
>;

export const ChoosePdfTypeForExport = (props: {
  isOpen: boolean;
  onClose: () => any;
  setLoading: (option: any) => any;
}) => {
  const { isOpen, onClose, setLoading } = props;
  const media = useMedia();
  const { songs } = useSongsStore();
  const navigation = useNavigation<PDFViewerScreenNavigationProp>();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent pb="$8">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <Text
          fontWeight="bold"
          lineHeight={media.md ? '$3xl' : undefined}
          fontSize={media.md ? '$2xl' : undefined}>
          {i18n.t('ui.export.type')}
        </Text>
        <ActionsheetItem
          onPress={() => {
            onClose();
            useSongsSelection.getState().enable();
          }}>
          <ActionsheetItemText
            fontSize={media.md ? '$2xl' : undefined}
            lineHeight={media.md ? '$3xl' : undefined}>
            {i18n.t('pdf_export_options.selected songs')}
          </ActionsheetItemText>
        </ActionsheetItem>
        <ActionsheetItem
          onPress={async () => {
            onClose();
            const localeNoCountry = i18n.locale.split('-')[0];
            const songToExport = songs.filter(
              (s) =>
                s.files.hasOwnProperty(i18n.locale) ||
                s.files.hasOwnProperty(localeNoCountry)
            );
            var parser = new SongsParser(PdfStyles);
            var items: Array<SongToPdf<PdfStyle>> = songToExport.map((s) => {
              return {
                song: s,
                render: parser.getForRender(s.fullText, i18n.locale),
              };
            });
            setLoading({
              isLoading: true,
              text: i18n.t('ui.export.processing songs', {
                total: songToExport.length,
              }),
            });
            const result = await generateSongPDF(
              items,
              PdfStyles,
              `iResucitó-${i18n.locale}`,
              true
            );
            navigation.navigate('PDFViewer', {
              data: result,
              title: i18n.t('pdf_export_options.complete book'),
            });
            setLoading({ isLoading: false, text: '' });
          }}>
          <ActionsheetItemText
            fontSize={media.md ? '$2xl' : undefined}
            lineHeight={media.md ? '$3xl' : undefined}>
            {i18n.t('pdf_export_options.complete book')}
          </ActionsheetItemText>
        </ActionsheetItem>
      </ActionsheetContent>
    </Actionsheet>
  );
};
