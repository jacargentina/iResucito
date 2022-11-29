import * as React from 'react';
import { HStack } from 'native-base';
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
