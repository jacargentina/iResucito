import * as React from 'react';
import { useTheme, HStack } from 'native-base';
import I18n from '@iresucito/translations';
import ViewPdfButton from '../components/ViewPdfButton';
import TransportNotesButton from '../components/TransportNotesButton';
import SharePDFButton from '../components/SharePDFButton';
import PrintPDFButton from '../components/PrintPDFButton';
import { Song } from '@iresucito/core';

export const getSongDetailOptions = (song: Song) => {
  return {
    title: song ? song.titulo : 'Salmo',
    headerRight: () => (
      <HStack m="1">
        <ViewPdfButton />
        <TransportNotesButton />
      </HStack>
    ),
  };
};

export const getPdfViewerOptions = (title: string) => {
  return {
    title: `PDF - ${title}`,
    headerRight: () => (
      <HStack m="1">
        <SharePDFButton />
        <PrintPDFButton />
      </HStack>
    ),
  };
};

export const useStackNavOptions = (): any => {
  const { colors } = useTheme();

  return {
    cardStyle: {
      backgroundColor: 'white',
    },
    headerStyle: {
      backgroundColor: colors.rose['500'],
    },
    headerTitleStyle: {
      color: 'white',
    },
    headerBackTitleStyle: {
      color: 'white',
    },
    headerTintColor: 'white',
    headerBackTitle: I18n.t('ui.back'),
    headerTruncatedBackTitle: I18n.t('ui.back'),
  };
};
