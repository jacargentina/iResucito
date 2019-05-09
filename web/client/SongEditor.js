// @flow
import React, { useState, useEffect, useContext } from 'react';
import { Menu, TextArea, Button } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import SongViewFrame from './SongViewFrame';
import I18n from '../../src/translations';

const SongEditor = () => {
  const data = useContext(DataContext);
  const { editSong, setEditSong, setConfirmData } = data;
  const [text, setText] = useState();
  const [hasChanges, setHasChanges] = useState(false);

  const confirmClose = () => {
    if (hasChanges) {
      setConfirmData({
        message: I18n.t('ui.discard confirmation'),
        yes: () => {
          setEditSong(null);
        }
      });
    } else {
      setEditSong(null);
    }
  };

  useEffect(() => {
    if (editSong) {
      setText(editSong.lines.join('\n'));
    }
  }, [editSong]);

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', padding: '0px 10px' }}>
      <Menu size="small">
        <Menu.Item header>{editSong.titulo.toUpperCase()}</Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Button
              primary
              floated="right"
              size="mini"
              onClick={null}
              disabled={!hasChanges}>
              {I18n.t('ui.apply')}
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button negative floated="right" size="mini" onClick={confirmClose}>
              {I18n.t('ui.cancel')}
            </Button>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'auto'
        }}>
        <TextArea
          style={{
            fontFamily: 'monospace',
            width: '50%',
            outline: 'none',
            resize: 'none',
            border: 0,
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
            paddingLeft: 10
          }}>
          <SongViewFrame text={text} />
        </div>
      </div>
    </div>
  );
};

export default SongEditor;
