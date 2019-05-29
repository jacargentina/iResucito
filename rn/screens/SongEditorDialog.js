// @flow
import React, { useContext, useState, useEffect } from 'react';
import ModalView from './ModalView';
import SongListItem from './SongListItem';
import { withNavigation } from 'react-navigation';
import { TextInput, View, Alert, ScrollView, Dimensions } from 'react-native';
import { Text, Button, Icon, ActionSheet } from 'native-base';
import { DataContext } from '../DataContext';
import I18n from '../../translations';
import commonTheme from '../native-base-theme/variables/platform';
import useUndo from 'use-undo';
import { NativeParser, generatePDF } from '../util';

const SongEditorDialog = (props: any) => {
  const data = useContext(DataContext);
  const { navigation } = props;
  const song: Song = navigation.getParam('song');

  const { getSongLocalePatch, setSongPatch } = data.songsMeta;
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
      var lines = song.fullText;
      if (
        patchObj &&
        patchObj[I18n.locale] &&
        patchObj[I18n.locale].hasOwnProperty('lines')
      ) {
        lines = patchObj[I18n.locale].lines;
        setCanDeletePatch(true);
      } else {
        setCanDeletePatch(false);
      }
      resetLines(lines);
    });
  };

  const saveWithLines = (text?: string) => {
    return setSongPatch(song, I18n.locale, { lines: text });
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
                titulo: song.titulo,
                fuente: song.fuente,
                stage: song.stage
              }
            });
            break;
          case 1:
            const fRender = NativeParser.getForRender(lines, I18n.locale);
            const item: SongToPdf = {
              canto: song,
              lines: fRender.items
            };
            const opts: ExportToPdfOptions = {
              createIndex: false,
              pageNumbers: false,
              fileSuffix: ''
            };
            generatePDF([item], opts).then(path => {
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

  return (
    <ModalView
      title={I18n.t('screen_title.song edit')}
      right={
        <Button
          rounded
          small
          style={{
            alignSelf: 'flex-end',
            color: commonTheme.brandPrimary,
            marginRight: 10
          }}
          disabled={!canUndoLines}
          onPress={() => {
            saveWithLines(lines);
            navigation.goBack(null);
          }}>
          <Text>{I18n.t('ui.apply')}</Text>
        </Button>
      }
      left={
        <Button
          rounded
          small
          style={{
            alignSelf: 'flex-start',
            color: commonTheme.brandPrimary,
            marginLeft: 10
          }}
          onPress={() => navigation.goBack(null)}>
          <Text>{I18n.t('ui.cancel')}</Text>
        </Button>
      }>
      <View style={{ flexGrow: 1, backgroundColor: '#222' }}>
        <SongListItem
          songKey={song.key}
          devModeDisabled={true}
          showBadge={true}
          patchSectionDisabled={true}
          onPress={choosePreview}
        />
        <ScrollView horizontal style={{ flex: 1 }}>
          <TextInput
            multiline
            textAlignVertical="top"
            style={{
              backgroundColor: '#222',
              color: 'white',
              fontSize: 16,
              paddingTop: 5,
              paddingLeft: 5,
              paddingRight: 5,
              paddingBottom: 5,
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
            margin: 4,
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
