import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, Actionsheet } from '../gluestack';
import i18n from '@iresucito/translations';
import { defaultExportToPdfOptions, SongToPdf } from '@iresucito/core';
import { NativeParser } from '../util';
import { generateSongPDF } from '../pdf';
import { SongsStackParamList } from '../navigation';
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
  const { songs } = useSongsStore();
  const navigation = useNavigation<PDFViewerScreenNavigationProp>();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Text fontWeight="bold">{i18n.t('ui.export.type')}</Text>
        <Actionsheet.Item
          onPress={() => {
            onClose();
            useSongsSelection.getState().enable();
          }}>
          {i18n.t('pdf_export_options.selected songs')}
        </Actionsheet.Item>
        <Actionsheet.Item
          onPress={async () => {
            onClose();
            const localeNoCountry = i18n.locale.split('-')[0];

            const songToExport = songs.filter(
              (s) =>
                s.files.hasOwnProperty(i18n.locale) ||
                s.files.hasOwnProperty(localeNoCountry)
            );
            var items: Array<SongToPdf> = songToExport.map((s) => {
              return {
                song: s,
                render: NativeParser.getForRender(s.fullText, i18n.locale),
              };
            });
            setLoading({
              isLoading: true,
              text: i18n.t('ui.export.processing songs', {
                total: songToExport.length,
              }),
            });
            const path = await generateSongPDF(
              items,
              defaultExportToPdfOptions,
              `iResucitó-${i18n.locale}`,
              true
            );
            navigation.navigate('PDFViewer', {
              uri: path,
              title: i18n.t('pdf_export_options.complete book'),
            });
            setLoading({ isLoading: false, text: '' });
          }}>
          {i18n.t('pdf_export_options.complete book')}
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};
