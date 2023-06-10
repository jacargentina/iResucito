import * as React from 'react';
import { HStack, Icon, Badge, Button } from '../gluestack';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import i18n from '@iresucito/translations';
import { Song, cleanMultichord, getChordsScale } from '@iresucito/core';
import { setSongSetting } from '../hooks';
import {
  ViewPdfButton,
  PrintPDFButton,
  SharePDFButton,
  HeaderButton,
} from '../components';
import { SongsStackParamList, useStackNavOptions } from './index';
import { config } from '../gluestack-ui.config';
import { MusicIcon } from 'lucide-react-native';

type SongDetailRouteProp = RouteProp<SongsStackParamList, 'SongDetail'>;

type SongDetailScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'SongDetail'
>;

const TransportNotesButton = () => {
  const options = useStackNavOptions();
  const navigation = useNavigation<SongDetailScreenNavigationProp>();
  const route = useRoute<SongDetailRouteProp>();
  const { song } = route.params;

  if (!song) {
    return null;
  }

  const chords = getChordsScale(i18n.locale);

  var menuOptionItems = chords.map((nota, i) => {
    var value = cleanMultichord(nota.source);
    var customStyles =
      value == song.transportTo
        ? {
            optionWrapper: {
              backgroundColor: config.theme.tokens.colors.rose300,
              paddingHorizontal: 10,
              paddingVertical: 10,
            },
            optionText: {
              color: 'white',
            },
          }
        : undefined;
    return (
      <MenuOption
        key={i}
        value={value}
        text={value}
        customStyles={customStyles}
      />
    );
  });

  const changeTransport = async (newTransport: any) => {
    var updatedSong = await setSongSetting(
      song.key,
      i18n.locale,
      'transportTo',
      newTransport
    );
    navigation.replace('SongDetail', {
      song: updatedSong,
    });
  };

  var trigger =
    song.transportTo === null ||
    song.transportTo === undefined ||
    song.transportTo === '' ? (
      <HeaderButton iconName="MusicIcon" />
    ) : (
      <Badge
        bg="$rose500"
        variant="solid"
        borderRadius={10}
        height="100%"
        style={{
          marginRight: 3,
        }}>
        <Badge.Text
          fontWeight="bold"
          fontStyle="italic"
          textAlign="center"
          color={options.headerTitleStyle.color}>
          {song.transportTo}
        </Badge.Text>
      </Badge>
    );
  return (
    <Menu onSelect={(value) => changeTransport(value)}>
      <MenuTrigger>{trigger}</MenuTrigger>
      <MenuOptions
        customStyles={{
          optionWrapper: { paddingHorizontal: 10, paddingVertical: 10 },
        }}>
        {song.transportTo != null && (
          <MenuOption value={null} text="Original" />
        )}
        {menuOptionItems}
      </MenuOptions>
    </Menu>
  );
};

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
