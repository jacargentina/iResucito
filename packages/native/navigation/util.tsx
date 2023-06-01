import * as React from 'react';
import { HStack } from '../gluestack';
import ViewPdfButton from '../components/ViewPdfButton';
import {
  PrintPDFButton,
  SharePDFButton,
  TransportNotesButton,
} from '../components';
import { Song } from '@iresucito/core';

export const getSongDetailOptions = (song: Song) => {
  return {
    title: song ? song.titulo : 'Salmo',
    headerRight: () => (
      <HStack m="$1">
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
      <HStack m="$1">
        <SharePDFButton />
        <PrintPDFButton />
      </HStack>
    ),
  };
};
