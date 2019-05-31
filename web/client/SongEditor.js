// @flow
import React, { Fragment, useContext, useState, useEffect } from 'react';
import TextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import SongViewFrame from './SongViewFrame';
import { useDebouncedCallback } from 'use-debounce';
import I18n from '../../translations';

const SongEditor = () => {
  const data = useContext(DataContext);
  const { setActiveDialog } = data;

  const edit = useContext(EditContext);
  const {
    editSong,
    text,
    setText,
    setHasChanges,
    songFile,
    confirmRemovePatch,
    hasChanges,
    applyChanges,
    confirmClose
  } = edit;
  const [debouncedText, setDebouncedText] = useState(text);
  const [callback, , callPending] = useDebouncedCallback(
    text => setDebouncedText(text),
    800
  );

  useEffect(() => {
    if (editSong) {
      callback(text);
      callPending();
    }
  }, [editSong]);

  if (!editSong) {
    return null;
  }

  return (
    <Fragment>
      <Menu size="mini" inverted attached color="blue">
        <Menu.Item>
          <Button.Group size="mini">
            <Button onClick={() => setActiveDialog('changeMetadata')}>
              <Icon name="edit" />
              {I18n.t('ui.edit')}
            </Button>
            {(editSong.patched || editSong.added) && (
              <Button negative onClick={confirmRemovePatch}>
                <Icon name="trash" />
                {I18n.t('ui.remove patch')}
              </Button>
            )}
            <Button onClick={() => setActiveDialog('patchLog')}>
              <Icon name="history" />
              {I18n.t('ui.patch log')}
            </Button>
            <Button
              positive={hasChanges}
              disabled={!hasChanges}
              onClick={applyChanges}>
              <Icon name="save" />
              {I18n.t('ui.apply')}
            </Button>
          </Button.Group>
        </Menu.Item>
        <Menu.Item position="right">
          <Button onClick={confirmClose}>
            <Icon name="close" />
            {I18n.t('ui.close')}
          </Button>
        </Menu.Item>
      </Menu>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'auto',
          padding: 10,
          position: 'relative'
        }}>
        <Popup
          header="Tips"
          content={
            <Message
              list={[
                'If present, title/source must be deleted from the heading to not be painted twice',
                'Put "clamp: x" at the start of any empty line to signal clamp position'
              ]}
            />
          }
          position="bottom left"
          trigger={
            <Icon
              name="help"
              color="blue"
              circular
              bordered
              style={{ position: 'absolute', left: '47%' }}
            />
          }
        />
        <TextArea
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#fcfcfc',
            width: '50%',
            outline: 'none',
            resize: 'none',
            border: 0,
            padding: '10px 20px',
            overflowY: 'scroll'
          }}
          value={text}
          onChange={(e, data) => {
            setHasChanges(true);
            setText(data.value);
            callback(data.value);
          }}
        />
        <div
          style={{
            width: '50%',
            overflowY: 'scroll',
            fontFamily: 'Franklin Gothic Medium',
            padding: '10px 20px'
          }}>
          <SongViewFrame
            title={songFile && songFile.titulo}
            source={songFile && songFile.fuente}
            text={debouncedText}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default SongEditor;
