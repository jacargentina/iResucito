// @flow
import React, { useContext, useState, useEffect } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { DataContext } from './DataContext';
import SongListItem from './SongListItem';
import { getSongFileFromString } from '../../SongsProcessor';
import { wayStages } from '../../common';
import I18n from '../../translations';

const SongChangeMetadataDialog = () => {
  const data = useContext(DataContext);
  const {
    editSong,
    activeDialog,
    setActiveDialog,
    rename,
    setRename,
    stage,
    setStage,
    setHasChanges
  } = data;
  const [actionEnabled, setActionEnabled] = useState(false);
  const [tipMessages, setTipMessages] = useState([]);
  const [name, setName] = useState('');
  const [changeSong, setChangeSong] = useState();

  useEffect(() => {
    if (editSong) {
      setName(rename || editSong.nombre);
      setStage(stage || editSong.stage);
    }
  }, [editSong]);

  useEffect(() => {
    if (name !== undefined) {
      var tips = [];
      var check1 = name.length > 0;
      if (!check1) {
        tips.push('Must have content');
      }
      var check2 = name.length === 0 || name.toUpperCase() !== name;
      if (!check2) {
        tips.push('Must not be "ALL UPERCASE", read help above');
      }
      var check3 = name.length === 0 || name.toLowerCase() !== name;
      if (!check3) {
        tips.push('Must not be "all lowercase", read help above');
      }
      var check4 = !name.includes('  ');
      if (!check4) {
        tips.push('Must not have double spaces inside! Please remove those');
      }
      setActionEnabled(tips.length === 0);
      setTipMessages(tips);
      const parsed = getSongFileFromString(name);
      const changed = Object.assign({}, editSong, parsed);
      setChangeSong(changed);
    }
  }, [name]);

  return (
    <Modal
      open={activeDialog === 'changeMetadata'}
      size="small"
      dimmer="blurring"
      centered={true}
      onClose={() => setActiveDialog()}>
      <Modal.Header>{I18n.t('ui.edit')}</Modal.Header>
      <Modal.Content>
        <h5>{I18n.t('ui.rename')}</h5>
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
        {tipMessages.length > 0 && <Message warning list={tipMessages} />}
        <h5>{I18n.t('search_title.stage')}</h5>
        <Dropdown
          style={{ marginLeft: 10 }}
          onChange={(e, { value }) => setStage(value)}
          selection
          value={stage}
          options={wayStages.map(name => {
            return {
              key: name,
              text: I18n.t(`search_title.${name}`),
              value: name
            };
          })}
        />
        <h5>{I18n.t('screen_title.preview')}</h5>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
          <div style={{ flex: 1, padding: 10 }}>
            <h5>{I18n.t('ui.original song')}</h5>
            {editSong && (
              <SongListItem
                titulo={editSong.titulo}
                fuente={editSong.fuente}
                stage={editSong.stage}
              />
            )}
          </div>
          <div style={{ flex: 1, padding: 10 }}>
            <h5>{I18n.t('ui.patched song')}</h5>
            {changeSong && (
              <SongListItem
                titulo={changeSong.titulo}
                fuente={changeSong.fuente}
                stage={stage}
              />
            )}
          </div>
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

export default SongChangeMetadataDialog;
