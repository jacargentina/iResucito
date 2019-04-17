// @flow
import React, { useContext, useState, useEffect } from 'react';
import ModalView from './ModalView';
import SongListItem from './SongListItem';
import { withNavigation } from 'react-navigation';
import { TextInput, View, Alert, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Icon, ActionSheet } from 'native-base';
import { DataContext } from '../DataContext';
import I18n from '../translations';
import commonTheme from '../native-base-theme/variables/platform';
import useUndo from 'use-undo';
import { NativeSongs, generatePDF } from '../util';

const SongEditorDialog = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const song = navigation.getParam('song');

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
      var lines = song.lines.join('\n');
      if (patchObj && patchObj[song.locale]) {
        lines = patchObj[song.locale].lines;
        setCanDeletePatch(true);
      } else {
        setCanDeletePatch(false);
      }
      resetLines(lines);
    });
  };

  const saveWithLines = (text?: string) => {
    return getSongLocalePatch(song).then(patchObj => {
      var file = song.nombre;
      var rename = undefined;
      if (patchObj && patchObj[song.locale]) {
        file = patchObj[song.locale].file;
        rename = patchObj[song.locale].rename;
      }
      return setSongLocalePatch(song, file, rename, text);
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

  const choosePreview = () => {
    ActionSheet.show(
      {
        options: [I18n.t('ui.screen'), I18n.t('ui.pdf'), I18n.t('ui.cancel')],
        cancelButtonIndex: 2,
        title: I18n.t('ui.preview type')
      },
      index => {
        index = Number(index);
        switch (index) {
          case 0:
            navigation.navigate('SongPreviewScreen', {
              data: {
                key: song.key,
                rating: song.rating,
                lines: lines.split('\n'),
                locale: song.locale,
                titulo: song.titulo,
                fuente: song.fuente,
                etapa: song.etapa
              }
            });
            break;
          case 1:
            const itemsToRender = NativeSongs.getSongLinesForRender(
              lines.split('\n'),
              song.locale
            );
            const item: SongToPdf = {
              canto: song,
              lines: itemsToRender
            };
            generatePDF([item]).then(path => {
              navigation.navigate('SongPreviewPdf', {
                uri: path,
                song: song
              });
            });
            break;
        }
      }
    );
  };

  useEffect(() => {
    reload();
  }, []);

  const cancelButton = (
    <Text
      style={{
        alignSelf: 'center',
        color: commonTheme.brandPrimary,
        marginLeft: 10
      }}
      onPress={() => navigation.goBack(null)}>
      {I18n.t('ui.cancel')}
    </Text>
  );

  const saveButton = (
    <Text
      style={{
        alignSelf: 'center',
        color: commonTheme.brandPrimary,
        marginRight: 10
      }}
      onPress={() => {
        // Solo guardar si hay alguna modificacion
        saveWithLines(lines);
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
      <View style={{ flex: 1, backgroundColor: '#222' }}>
        <SongListItem
          songKey={song.key}
          devModeDisabled={true}
          showBadge={true}
          patchSectionDisabled={true}
          onPress={choosePreview}
        />
        <ScrollView horizontal>
          <TextInput
            multiline
            textAlignVertical="top"
            style={{
              backgroundColor: '#222',
              color: 'white',
              fontSize: 16,
              paddingTop: 20,
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 60,
              minWidth: Dimensions.get('window').width
            }}
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
