// @flow
import * as React from 'react';
import { useContext } from 'react';
import { Alert } from 'react-native';
import { Icon, ActionSheet } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DataContext } from '../DataContext';
import I18n from '../../translations';
import useStackNavOptions from '../navigation/useStackNavOptions';
import { NativeParser } from '../util';
import { generateSongPDF } from '../pdf';
import { defaultExportToPdfOptions } from '../../common';

const ExportToPdfButton = (): React.Node => {
  const options = useStackNavOptions();
  const data = useContext(DataContext);
  const { songs } = data.songsMeta;
  const [, setLoading] = data.loading;
  const navigation = useNavigation();

  const chooseExport = () => {
    ActionSheet.show(
      {
        options: [
          I18n.t('pdf_export_options.selected songs'),
          I18n.t('pdf_export_options.complete book'),
          I18n.t('ui.cancel'),
        ],
        cancelButtonIndex: 2,
        title: I18n.t('ui.export.type'),
      },
      (index) => {
        index = Number(index);
        switch (index) {
          case 0:
            Alert.alert('TODO', 'TBD');
            break;
          case 1:
            const localeNoCountry = I18n.locale.split('-')[0];
            const songToExport = songs.filter(
              (s) =>
                s.files.hasOwnProperty(I18n.locale) ||
                s.files.hasOwnProperty(localeNoCountry)
            );
            var items: Array<SongToPdf> = songToExport.map((s) => {
              return {
                song: s,
                render: NativeParser.getForRender(s.fullText, I18n.locale),
              };
            });
            setLoading({
              isLoading: true,
              text: I18n.t('ui.export.processing songs', {
                total: songToExport.length,
              }),
            });
            generateSongPDF(
              items,
              defaultExportToPdfOptions,
              `-${I18n.locale}`
            ).then((path) => {
              navigation.navigate('PDFViewer', {
                uri: path,
                title: I18n.t('ui.export.pdf viewer title'),
              });
              setLoading({ isLoading: false, text: '' });
            });
            break;
        }
      }
    );
  };

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
      onPress={chooseExport}
    />
  );
};

export default ExportToPdfButton;
