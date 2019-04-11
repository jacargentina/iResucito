// @flow
import React, { useContext, useState, useEffect } from 'react';
import ModalView from './ModalView';
import SongListItem from './SongListItem';
import { withNavigation } from 'react-navigation';
import { TextInput, View, Alert, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Icon } from 'native-base';
import { DataContext } from '../DataContext';
import I18n from '../translations';
import commonTheme from '../native-base-theme/variables/platform';
import useUndo from 'use-undo';

const SongEditorDialog = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  var song = navigation.getParam('song');

  const { getSongLocalePatch, setSongLocalePatch } = data.songsMeta;
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [canDeletePatch, setCanDeletePatch] = useState(false);
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
  ] = useUndo('');

  const { present: lines } = linesState;

  const confirmReload = () => {
    Alert.alert(
      `${I18n.t('ui.reload')} "${song.titulo}"`,
      I18n.t('ui.reload confirmation'),
      [
        {
          text: I18n.t('ui.yes'),
          onPress: reload,
          style: 'destructive'
        },
        {
          text: I18n.t('ui.cancel'),
          style: 'cancel'
        }
      ]
    );
  };

  const confirmDelete = () => {
    Alert.alert(
      `${I18n.t('ui.delete')} "${song.titulo}"`,
      I18n.t('ui.delete confirmation'),
      [
        {
          text: I18n.t('ui.yes'),
          onPress: async () => {
            await saveWithLines();
            reload();
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

  const reload = () => {
    getSongLocalePatch(song).then(patchObj => {
      const patch = patchObj[I18n.locale];
      if (patch.lines && patch.lines !== '') {
        setCanDeletePatch(true);
        resetLines(patch.lines);
      } else {
        setCanDeletePatch(false);
        resetLines(song.lines.join('\n'));
      }
    });
  };

  const saveWithLines = (text?: string) => {
    return getSongLocalePatch(song).then(patchObj => {
      const patch = patchObj[I18n.locale];
      return setSongLocalePatch(song, patch.file, patch.rename, text);
    });
  };

  const cutToNextNewline = () => {
    var finalCutPosition = lines.indexOf('\n', selection.start);
    if (finalCutPosition == -1) {
      finalCutPosition = lines.length;
    }
    const sectionMove = lines.substring(selection.start, finalCutPosition);
    if (sectionMove.trim().length > 0) {
      const updatedLines =
        lines.replace(lines.substring(selection.start, finalCutPosition), '') +
        '\n' +
        sectionMove;
      setLines(updatedLines);
    }
  };

  useEffect(() => {
    reload();
  }, []);

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
      onPress={() => {
        // Solo guardar si hay alguna modificacion
        if (canUndoLines) {
          saveWithLines(lines);
        }
        navigation.goBack(null);
      }}>
      {I18n.t('ui.done')}
    </Text>
  );

  return (
    <ModalView
      title={I18n.t('screen_title.song edit')}
      right={saveButton}
      left={cancelButton}>
      <View style={{ flex: 1 }}>
        <SongListItem
          song={song}
          devModeDisabled={true}
          showBadge={true}
          patchSectionDisabled={true}
        />
        <ScrollView horizontal>
          <TextInput
            style={{
              fontSize: 16,
              padding: 10,
              minWidth: Dimensions.get('window').width
            }}
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
            flex: 0,
            left: 8,
            right: 8,
            bottom: 8,
            position: 'absolute',
            flexDirection: 'row-reverse',
            justifyContent: 'space-between'
          }}>
          <Button
            rounded
            style={{ backgroundColor: commonTheme.brandPrimary }}
            onPress={cutToNextNewline}>
            <Icon name="arrow-down" />
          </Button>
          {canDeletePatch && (
            <Button
              rounded
              style={{ backgroundColor: commonTheme.brandPrimary }}
              onPress={confirmDelete}>
              <Icon name="trash" />
            </Button>
          )}
          {canUndoLines && (
            <Button
              rounded
              style={{ backgroundColor: commonTheme.brandPrimary }}
              onPress={confirmReload}>
              <Icon name="refresh" />
            </Button>
          )}
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
