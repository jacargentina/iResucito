// @flow
import React, { useContext, useState, useEffect } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { DataContext } from './DataContext';
import { getSongFileFromString } from '../../src/SongsProcessor';
import I18n from '../../src/translations';
import SongListItem from './SongListItem';

const SongChangeNameDialog = () => {
  const data = useContext(DataContext);
  const {
    editSong,
    activeDialog,
    setActiveDialog,
    rename,
    setRename,
    setHasChanges
  } = data;
  const [actionEnabled, setActionEnabled] = useState(false);
  const [name, setName] = useState('');
  const [original, setOriginal] = useState('');
  const [changeSong, setChangeSong] = useState();

  useEffect(() => {
    if (editSong) {
      setName(rename || editSong.nombre);
      setOriginal(rename || editSong.nombre);
    }
  }, [editSong]);

  useEffect(() => {
    if (name !== undefined) {
      setActionEnabled(name.length > 0 && name !== original);
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
          fluid
          autoFocus
          value={name}
          onChange={(e, { value }) => {
            setName(value);
          }}
        />
        <div style={{ marginTop: 10, marginBottom: 10, color: 'gray' }}>
          {I18n.t('ui.song change name help')}
        </div>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <div style={{ fontWeight: 'bold', fontSize: 17 }}>
            {I18n.t('ui.original song')}
          </div>
          {editSong && (
            <SongListItem nombre={editSong.titulo} fuente={editSong.fuente} />
          )}
        </div>
        <div style={{ marginTop: 10, marginBottom: 10 }}>
          <div style={{ fontWeight: 'bold', fontSize: 17 }}>
            {I18n.t('ui.patched song')}
          </div>
          {changeSong && (
            <SongListItem
              nombre={changeSong.titulo}
              fuente={changeSong.fuente}
            />
          )}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          disabled={!actionEnabled}
          onClick={() => {
            setRename(name);
            setHasChanges(true);
            setActiveDialog();
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
