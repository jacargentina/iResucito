// @flow
import React, { useState } from 'react';
import ModalView from './ModalView';
import { withNavigation } from 'react-navigation';
import { TextInput, View, Alert, ScrollView } from 'react-native';
import { Text, Button, Icon } from 'native-base';
import I18n from '../translations';
import commonTheme from '../native-base-theme/variables/platform';
import useUndo from 'use-undo';

const SongEditorDialog = (props: any) => {
  const { navigation } = props;
  var song = navigation.getParam('song');
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [
    linesState,
    {
      set: setLines,
      reset: resetLines,
      undo: undoLines,
      redo: redoLines,
      canRedo: canRedoLines,
      canUndo: canUndoLines
    }
  ] = useUndo(song.lines.join('\n'));

  const { present: lines } = linesState;

  const confirmReload = () => {
    Alert.alert(
      `${I18n.t('ui.reload')} "${song.titulo}"`,
      I18n.t('ui.reload confirmation'),
      [
        {
          text: I18n.t('ui.yes'),
          onPress: () => {
            resetLines(song.lines.join('\n'));
          },
          style: 'destructive'
        },
        {
          text: I18n.t('ui.cancel'),
          style: 'cancel'
        }
      ]
    );
  };
  const applyChanges = () => {
    // todo SAVE
    navigation.goBack(null);
  };

  const cutToNextNewline = () => {
    const nextNewline = lines.indexOf('\n', selection.start);
    const sectionMove = '\n' + lines.substring(selection.start, nextNewline);
    const updatedLines =
      lines.replace(lines.substring(selection.start, nextNewline), '') +
      sectionMove;
    setLines(updatedLines);
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
      onPress={applyChanges}>
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
          onPress={confirmReload}
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: 10,
            backgroundColor: commonTheme.listDividerBg
          }}>
          {song.titulo} {I18n.t('ui.reload')}
        </Text>
        <ScrollView horizontal>
          <TextInput
            style={{ fontSize: 14, padding: 10 }}
            multiline
            onChangeText={text => {
              setLines(text);
            }}
            value={lines}
            autoCorrect={false}
            onSelectionChange={event => {
              setSelection(event.nativeEvent.selection);
            }}
          />
        </ScrollView>
        <View
          style={{
            margin: 20,
            flex: 0,
            flexDirection: 'row-reverse',
            justifyContent: 'space-between'
          }}>
          <Button
            rounded
            style={{ backgroundColor: commonTheme.brandPrimary }}
            onPress={cutToNextNewline}>
            <Icon name="arrow-down" />
          </Button>

          {canRedoLines && (
            <Button
              rounded
              style={{ backgroundColor: commonTheme.brandPrimary }}
              onPress={redoLines}>
              <Icon name="redo" />
            </Button>
          )}
          {canUndoLines && (
            <Button
              rounded
              style={{ backgroundColor: commonTheme.brandPrimary }}
              onPress={undoLines}>
              <Icon name="undo" />
            </Button>
          )}
        </View>
      </View>
    </ModalView>
  );
};

export default withNavigation(SongEditorDialog);
