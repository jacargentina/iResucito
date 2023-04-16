import * as React from 'react';
import { Text, Icon, Badge, useTheme } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import i18n from '@iresucito/translations';
import { getChordsScale, Song } from '@iresucito/core';
import { setSongSetting } from '../hooks';
import useStackNavOptions from '../navigation/StackNavOptions';
import { SongsStackParamList } from '../navigation/SongsNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type SongDetailRouteProp = RouteProp<SongsStackParamList, 'SongDetail'>;

type SongDetailScreenNavigationProp = StackNavigationProp<
  SongsStackParamList,
  'SongDetail'
>;

const TransportNotesButton = () => {
  const options = useStackNavOptions();
  const navigation = useNavigation<SongDetailScreenNavigationProp>();
  const { colors } = useTheme();
  const route = useRoute<SongDetailRouteProp>();
  const { song } = route.params;

  if (!song) {
    return null;
  }

  const chords = getChordsScale(i18n.locale);

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
        : undefined;
    return (
      <MenuOption
        key={i}
        value={nota}
        text={nota}
        customStyles={customStyles}
      />
    );
  });

  const changeTransport = async (newTransport: any) => {
    var updatedSong = await setSongSetting(song.key, i18n.locale, 'transportTo', newTransport);
    navigation.replace('SongDetail', {
      song: updatedSong
    });
  };

  var trigger =
    song.transportTo === null ||
      song.transportTo === undefined ||
      song.transportTo === '' ? (
      <Icon
        as={Ionicons}
        name="musical-notes-outline"
        size="xl"
        style={{
          marginTop: 4,
          marginRight: 8,
        }}
        color={options.headerTitleStyle.color}
      />
    ) : (
      <Badge
        colorScheme="rose"
        variant="solid"
        borderRadius={10}
        height="100%"
        style={{
          marginRight: 3,
        }}>
        <Text
          bold
          italic
          textAlign="center"
          color={options.headerTitleStyle.color}>
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
        }}>
        {song.transportTo != null && (
          <MenuOption value={null} text="Original" />
        )}
        {menuOptionItems}
      </MenuOptions>
    </Menu>
  );
};

export default TransportNotesButton;
