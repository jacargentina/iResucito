import * as React from 'react';
import { useContext } from 'react';
import { Text, Icon, Badge, useTheme } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useNavigation, useRoute } from '@react-navigation/native';
import I18n from '@iresucito/translations';
import { getChordsScale } from '@iresucito/core';
import { DataContext } from '../DataContext';
import useStackNavOptions from '../navigation/useStackNavOptions';

const TransportNotesButton = (props: any): React.Node => {
  const data = useContext(DataContext);
  const options = useStackNavOptions();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const route = useRoute();
  const { setSongSetting } = data.songsMeta;
  const { song } = route.params;

  if (!song) {
    return null;
  }

  const chords = getChordsScale(I18n.locale);

  var menuOptionItems = chords.map((nota, i) => {
    var customStyles =
      song.transportTo === nota
        ? {
            optionWrapper: {
              backgroundColor: colors.rose['300'],
              paddingHorizontal: 10,
              paddingVertical: 10,
            },
            optionText: {
              color: 'white',
            },
          }
        : null;
    return (
      <MenuOption
        key={i}
        value={nota}
        text={nota}
        customStyles={customStyles}
      />
    );
  });

  const changeTransport = (newTransport: any) => {
    setSongSetting(song.key, I18n.locale, 'transportTo', newTransport).then(
      (updatedSong) => {
        navigation.replace('SongDetail', {
          song: updatedSong,
        });
      }
    );
  };

  var trigger =
    song.transportTo === null ||
    song.transportTo === undefined ||
    song.transportTo === '' ? (
      <Icon
        as={Ionicons}
        name="musical-notes-outline"
        size="md"
        style={{
          marginTop: 4,
          marginRight: 8,
          color: options.headerTitleStyle.color,
        }}
      />
    ) : (
      <Badge
        colorScheme="rose"
        variant="solid"
        style={{
          marginRight: 3,
        }}
      >
        <Text
          bold
          italic
          textAlign="center"
          color={options.headerTitleStyle.color}
        >
          {song.transportTo}
        </Text>
      </Badge>
    );
  return (
    <Menu onSelect={(value) => changeTransport(value)}>
      <MenuTrigger>{trigger}</MenuTrigger>
      <MenuOptions
        customStyles={{
          optionWrapper: { paddingHorizontal: 10, paddingVertical: 10 },
        }}
      >
        {song.transportTo != null && (
          <MenuOption value={null} text="Original" />
        )}
        {menuOptionItems}
      </MenuOptions>
    </Menu>
  );
};

export default TransportNotesButton;
