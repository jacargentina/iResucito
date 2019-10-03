// @flow
import React, { useContext, useEffect, useState } from 'react';
import { withNavigation } from 'react-navigation';
import { View } from 'react-native';
import { Text, Icon, Badge } from 'native-base';
import KeepAwake from 'react-native-keep-awake';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';
import { getChordsScale, defaultExportToPdfOptions } from '../../common';
import { NativeParser } from '../util';
import { generatePDF } from '../pdf';
import { DataContext } from '../DataContext';
import I18n from '../../translations';
import StackNavigatorOptions from '../navigation/StackNavigatorOptions';
import commonTheme from '../native-base-theme/variables/platform';
import SongViewFrame from './SongViewFrame';

const SongDetail = (props: any) => {
  const data = useContext(DataContext);
  const [keepAwake] = data.keepAwake;
  const { navigation } = props;
  const [transportNote, setTransportNote] = useState();

  var song: Song = navigation.getParam('song');

  useEffect(() => {
    navigation.setParams({ transportNote, setTransportNote });
  }, [transportNote, setTransportNote]);

  useEffect(() => {
    if (keepAwake) {
      KeepAwake.activate();
      return function() {
        KeepAwake.deactivate();
      };
    }
  }, []);

  return (
    <SongViewFrame
      title={song.titulo}
      source={song.fuente}
      stage={song.stage}
      text={song.fullText}
      error={song.error}
      transportToNote={transportNote}
    />
  );
};

const TransportNotesMenu = withNavigation((props: any) => {
  const { navigation } = props;
  const song = navigation.getParam('song');
  if (!song) {
    return null;
  }

  const chords = getChordsScale(I18n.locale);
  const transportNote = navigation.getParam('transportNote');
  const setTransportNote = navigation.getParam('setTransportNote');

  var menuOptionItems = chords.map((nota, i) => {
    if (transportNote === nota)
      var customStyles = {
        optionWrapper: {
          backgroundColor: commonTheme.brandPrimary,
          paddingHorizontal: 10,
          paddingVertical: 10
        },
        optionText: {
          color: 'white'
        }
      };
    return (
      <MenuOption
        key={i}
        value={nota}
        text={nota}
        customStyles={customStyles}
      />
    );
  });
  var trigger =
    transportNote === null || transportNote === undefined ? (
      <Icon
        name="musical-note"
        style={{
          marginTop: 4,
          marginRight: 8,
          width: 32,
          fontSize: 30,
          textAlign: 'center',
          color: StackNavigatorOptions.headerTitleStyle.color
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
            color: StackNavigatorOptions.headerTitleStyle.color
          }}>
          {transportNote}
        </Text>
      </Badge>
    );
  return (
    <Menu onSelect={value => setTransportNote(value)}>
      <MenuTrigger>{trigger}</MenuTrigger>
      <MenuOptions
        customStyles={{
          optionWrapper: { paddingHorizontal: 10, paddingVertical: 10 }
        }}>
        {transportNote != null && <MenuOption value={null} text="Original" />}
        {menuOptionItems}
      </MenuOptions>
    </Menu>
  );
});

const ViewPdf = withNavigation(props => {
  const { navigation } = props;
  const song = navigation.getParam('song');
  if (!song) {
    return null;
  }
  const transportToNote = navigation.getParam('transportNote');

  return (
    <Icon
      name="paper"
      style={{
        marginTop: 4,
        marginRight: 8,
        width: 32,
        fontSize: 30,
        textAlign: 'center',
        color: StackNavigatorOptions.headerTitleStyle.color
      }}
      onPress={() => {
        const { fullText } = song;
        const render = NativeParser.getForRender(
          fullText,
          I18n.locale,
          transportToNote
        );
        const item: SongToPdf = {
          song,
          render
        };
        generatePDF([item], defaultExportToPdfOptions, '').then(path => {
          navigation.navigate('PDFViewer', {
            uri: path,
            title: song.titulo
          });
        });
      }}
    />
  );
});

SongDetail.navigationOptions = (props: any) => {
  const song = props.navigation.getParam('song');
  return {
    title: song ? song.titulo : 'Salmo',
    headerBackTitle: I18n.t('ui.back'),
    headerTruncatedBackTitle: I18n.t('ui.back'),
    headerRight: (
      <View style={{ flexDirection: 'row' }}>
        <ViewPdf />
        <TransportNotesMenu />
      </View>
    )
  };
};

export default SongDetail;
