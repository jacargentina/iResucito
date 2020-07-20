// @flow
import React from 'react';
import { Text, Icon, Badge } from 'native-base';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { getChordsScale } from '../../common';
import { useNavigation, useRoute } from '@react-navigation/native';
import I18n from '../../translations';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import commonTheme from '../native-base-theme/variables/platform';

const TransportNotesButton = (props: any) => {
  const navigation = useNavigation();
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
              backgroundColor: commonTheme.brandPrimary,
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
        name="music"
        type="FontAwesome"
        style={{
          marginTop: 4,
          marginRight: 8,
          width: 32,
          fontSize: 30,
          textAlign: 'center',
          color: StackNavigatorOptions().headerTitleStyle.color,
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
            color: StackNavigatorOptions().headerTitleStyle.color,
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
