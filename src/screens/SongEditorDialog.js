// @flow
import React, { useState } from 'react';
import ModalView from './ModalView';
import { withNavigation } from 'react-navigation';
import { TextInput, View, Alert, ScrollView } from 'react-native';
import { Text, Fab, Icon } from 'native-base';
import I18n from '../translations';
import commonTheme from '../native-base-theme/variables/platform';

const SongEditorDialog = (props: any) => {
  const { navigation } = props;
  var song = navigation.getParam('song');
  const [selection, setSelection] = useState([0, 0]);
  const [lines, setLines] = useState(song.lines.join('\n'));
  const [cut, setCut] = useState([]);

  const save = () => {
    Alert.alert('save', 'save');
  };

  const cutToNextNewline = () => {
    const nextNewline = lines.indexOf('\n', selection[0]);
    const value = lines.substring(selection[0], nextNewline);
    setCut(cut => [...cut, value]);
    setLines(
      str => (str = str.replace(str.substring(selection[0], nextNewline), ''))
    );
  };

  const pasteCutted = () => {
    const toPaste = cut.join('\n');
    setLines(
      str =>
        (str =
          str.substring(0, selection[0]) +
          toPaste +
          str.substring(selection[0]))
    );
    setCut([]);
  };
  var cancelButton = (
    <Text
      style={{
        alignSelf: 'center',
        color: commonTheme.brandPrimary,
        marginRight: 10
      }}
      onPress={() => navigation.goBack(null)}>
      {I18n.t('ui.cancel')}
    </Text>
  );

  var saveButton = (
    <Text
      style={{
        alignSelf: 'center',
        color: commonTheme.brandPrimary,
        marginRight: 10
      }}
      onPress={save}>
      {I18n.t('ui.done')}
    </Text>
  );

  return (
    <ModalView
      title={I18n.t('screen_title.song edit')}
      right={saveButton}
      left={cancelButton}>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: 10,
            backgroundColor: commonTheme.listDividerBg
          }}>
          {song.titulo}
        </Text>
        <ScrollView horizontal>
          <TextInput
            style={{ fontSize: 14, flex: 0, padding: 10 }}
            multiline
            onChangeText={text => {
              setLines(text);
            }}
            value={lines}
            autoCorrect={false}
            onSelectionChange={event => {
              const selection = event.nativeEvent.selection;
              setSelection([selection.start, selection.end]);
            }}
          />
        </ScrollView>
        <Fab
          containerStyle={{}}
          style={{ backgroundColor: commonTheme.brandPrimary }}
          position="bottomRight"
          onPress={cutToNextNewline}>
          <Icon name="cut" />
        </Fab>
        <Fab
          containerStyle={{}}
          style={{ backgroundColor: commonTheme.brandPrimary }}
          position="bottomLeft"
          onPress={pasteCutted}>
          <Icon name="clipboard" />
        </Fab>
      </View>
    </ModalView>
  );
};

export default withNavigation(SongEditorDialog);
