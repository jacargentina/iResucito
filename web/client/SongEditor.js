// @flow
import React, { useEffect, useContext } from 'react';
import TextArea from 'semantic-ui-react/dist/commonjs/addons/TextArea';
import { DataContext } from './DataContext';
import SongViewFrame from './SongViewFrame';

const SongEditor = () => {
  const data = useContext(DataContext);
  const { editSong, text, setText, setHasChanges, songFile } = data;

  useEffect(() => {
    if (editSong) {
      setText(editSong.lines.join('\n'));
    }
  }, [editSong]);

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
          text={text}
        />
      </div>
    </div>
  );
};

export default SongEditor;
