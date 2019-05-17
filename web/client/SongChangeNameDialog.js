// @flow
import React, { useContext, useState, useEffect } from 'react';
import { Modal, Button, Input } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import { getSongFileFromString } from '../../src/SongsProcessor';
import I18n from '../../src/translations';
import SongListItem from './SongListItem';

const SongChangeNameDialog = () => {
  const data = useContext(DataContext);
  const { editSong, activeDialog, setActiveDialog } = data;
  const nameToEdit = editSong ? editSong.nombre : '';
  const [actionEnabled, setActionEnabled] = useState(false);
  const [name, setName] = useState(nameToEdit);
  const [changeSong, setChangeSong] = useState(
    getSongFileFromString(nameToEdit)
  );

  const runAction = () => {
    // TODO action(name);
    setActiveDialog();
  };

  useEffect(() => {
    if (name !== undefined) {
      setActionEnabled(name.length > 0 && name !== nameToEdit);
      const parsed = getSongFileFromString(name);
      const changed = Object.assign({}, editSong, parsed);
      setChangeSong(changed);
    }
  }, [name]);

  return (
    <Modal
      open={activeDialog === 'changeName'}
      size="small"
      centered={true}
      onClose={() => setActiveDialog()}>
      <Modal.Content>
        <h3>{I18n.t('ui.rename')}</h3>
        <Input
          error={!actionEnabled}
          autoFocus
          value={name}
          onChange={(e, { value }) => {
            setName(value);
          }}
          clearButtonMode="always"
          autoCorrect={false}
        />
        <div style={{ margin: 10 }}>{I18n.t('ui.song change name help')}</div>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <div style={{ fontWeight: 'bold', fontSize: 17 }}>
            {I18n.t('ui.original song')}
          </div>
          {editSong && (
            <SongListItem nombre={editSong.nombre} fuente={editSong.fuente} />
          )}
        </div>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <div style={{ fontWeight: 'bold', fontSize: 17 }}>
            {I18n.t('ui.patched song')}
          </div>
          <SongListItem nombre={changeSong.nombre} fuente={changeSong.fuente} />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          disabled={!actionEnabled}
          onClick={() => {
            if (actionEnabled) {
              runAction();
            }
          }}>
          {I18n.t('ui.apply')}
        </Button>
        <Button negative onClick={() => setActiveDialog()}>
          {I18n.t('ui.cancel')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default SongChangeNameDialog;
