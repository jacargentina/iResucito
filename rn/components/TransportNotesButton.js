// @flow
import * as React from 'react';
import { Text, Icon, Badge, useTheme } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { useNavigation, useRoute } from '@react-navigation/native';
import I18n from '../../translations';
import { getChordsScale } from '../../common';
import useStackNavOptions from '../navigation/useStackNavOptions';

const TransportNotesButton = (props: any): React.Node => {
  const options = useStackNavOptions();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const route = useRoute();
  const { song, transportNote } = route.params;

  if (!song) {
    return null;
  }

  const chords = getChordsScale(I18n.locale);

  var menuOptionItems = chords.map((nota, i) => {
    var customStyles =
      transportNote === nota
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
    navigation.replace('SongDetail', {
      song: song,
      transportNote: newTransport,
    });
  };

  var trigger =
    transportNote === null || transportNote === undefined ? (
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
      <Badge style={{ marginTop: 6, marginRight: 6 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 'bold',
            fontStyle: 'italic',
            textAlign: 'center',
            color: options.headerTitleStyle.color,
          }}>
          {transportNote}
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
        {transportNote != null && <MenuOption value={null} text="Original" />}
        {menuOptionItems}
      </MenuOptions>
    </Menu>
  );
};

export default TransportNotesButton;
