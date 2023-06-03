import * as React from 'react';
import { HStack } from '../gluestack';
import {
  ViewPdfButton,
  PrintPDFButton,
  SharePDFButton,
  TransportNotesButton,
} from '../components';
import { Song } from '@iresucito/core';

export const getSongDetailOptions = (song: Song) => {
  return {
    title: song ? song.titulo : 'Salmo',
    headerRight: () => (
      <HStack>
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
      <HStack>
        <SharePDFButton />
        <PrintPDFButton />
      </HStack>
    ),
  };
};
