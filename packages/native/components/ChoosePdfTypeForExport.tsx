import * as React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, Actionsheet } from 'native-base';
import i18n from '@iresucito/translations';
import { defaultExportToPdfOptions, SongToPdf } from '@iresucito/core';
import { useSongsMeta } from '../hooks';
import { NativeParser } from '../util';
import { generateSongPDF } from '../pdf';

import type { SongsStackParamList } from '../navigation/SongsNavigator';

type PDFViewerScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'PDFViewer'
>;

const ChoosePdfTypeForExport = (props: { chooser: any; setLoading: Function }) => {
  const { isOpen, onClose } = props.chooser;
  const { setLoading } = props;
  const navigation = useNavigation<PDFViewerScreenNavigationProp>();
  const { songs } = useSongsMeta();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Text bold>{i18n.t('ui.export.type')}</Text>
        <Actionsheet.Item
          onPress={() => {
            onClose();
            Alert.alert('TODO', 'TBD');
          }}>
          {i18n.t('pdf_export_options.selected songs')}
        </Actionsheet.Item>
        <Actionsheet.Item
          onPress={() => {
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
            generateSongPDF(
              items,
              defaultExportToPdfOptions,
              `-${i18n.locale}`
            ).then((path) => {
              navigation.navigate('PDFViewer', {
                uri: path,
                title: i18n.t('ui.export.pdf viewer title'),
              });
              setLoading({ isLoading: false, text: '' });
            });
          }}>
          {i18n.t('pdf_export_options.complete book')}
        </Actionsheet.Item>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ChoosePdfTypeForExport;
