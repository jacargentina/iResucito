import * as React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, Actionsheet } from 'native-base';
import i18n from '@iresucito/translations';
import { defaultExportToPdfOptions, Song, SongToPdf } from '@iresucito/core';
import { NativeParser } from '../util';
import { generateSongPDF } from '../pdf';
import type { SongsStackParamList } from '../navigation/SongsNavigator';
import { useSongsStore, useSongsSelection } from '../hooks';

type PDFViewerScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'PDFViewer'
>;

const ChoosePdfTypeForExport = (props: { chooser: any; setLoading: Function }) => {
  const { isOpen, onClose } = props.chooser;
  const { setLoading } = props;
  const [songs] = useSongsStore();
  const [, selectionActions] = useSongsSelection();
  const navigation = useNavigation<PDFViewerScreenNavigationProp>();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Text bold>{i18n.t('ui.export.type')}</Text>
        <Actionsheet.Item
          onPress={() => {
            onClose();
            // @ts-ignore
            selectionActions.enable();
          }}>
          {i18n.t('pdf_export_options.selected songs')}
        </Actionsheet.Item>
        <Actionsheet.Item
          onPress={() => {
            onClose();
            const localeNoCountry = i18n.locale.split('-')[0];
            if (songs) {
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
              generateSongPDF(
                items,
                defaultExportToPdfOptions,
                `-${i18n.locale}`,
                true
              ).then((path) => {
                navigation.navigate('PDFViewer', {
                  uri: path,
                  title: i18n.t('pdf_export_options.complete book'),
                });
                setLoading({ isLoading: false, text: '' });
              });
            }
          }}>
          {i18n.t('pdf_export_options.complete book')}
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ChoosePdfTypeForExport;
