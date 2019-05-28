// @flow
import React, { useContext } from 'react';
import TextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea';
import { EditContext } from './EditContext';
import SongViewFrame from './SongViewFrame';
import { useDebounce } from 'use-debounce';

const SongEditor = () => {
  const edit = useContext(EditContext);
  const { editSong, text, setText, setHasChanges, songFile } = edit;
  const [debouncedText] = useDebounce(text, 800);

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
        padding: 10
      }}>
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
