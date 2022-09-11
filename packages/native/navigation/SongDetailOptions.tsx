import * as React from 'react';
import { HStack } from 'native-base';
import ViewPdfButton from '../components/ViewPdfButton';
import TransportNotesButton from '../components/TransportNotesButton';

const SongDetailOptions = ({ navigation, route }: any): any => {
  const song = route.params.song;
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

export default SongDetailOptions;
