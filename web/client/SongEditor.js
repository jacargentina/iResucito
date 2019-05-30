// @flow
import React, { useContext, useState, useEffect } from 'react';
import TextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import { EditContext } from './EditContext';
import SongViewFrame from './SongViewFrame';
import { useDebouncedCallback } from 'use-debounce';

const SongEditor = () => {
  const edit = useContext(EditContext);
  const { editSong, text, setText, setHasChanges, songFile } = edit;
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
  );
};

export default SongEditor;
