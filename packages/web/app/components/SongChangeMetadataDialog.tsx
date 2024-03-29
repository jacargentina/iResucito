import { useContext, useState, useEffect } from 'react';
import { Button, Input, Message, Modal, Dropdown } from 'semantic-ui-react';
import { EditContext } from './EditContext';
import SongListItem from './SongListItem';
import { wayStages, getSongDetails, Song } from '@iresucito/core';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';

const SongChangeMetadataDialog = () => {
  const app = useApp();
  const { activeDialog, setActiveDialog } = app;

  const edit = useContext(EditContext);

  const [actionEnabled, setActionEnabled] = useState(false);
  const [tipMessages, setTipMessages] = useState<string[]>([]);
  const [changeSong, setChangeSong] = useState<Song>();

  useEffect(() => {
    if (edit && edit.name !== undefined) {
      const tips = [];
      const check1 = edit.name.length > 0;
      if (!check1) {
        tips.push('Must have content');
      }
      const check2 =
        edit.name.length === 0 || edit.name.toUpperCase() !== edit.name;
      if (!check2) {
        tips.push('Must not be "ALL UPERCASE", read help above');
      }
      const check3 =
        edit.name.length === 0 || edit.name.toLowerCase() !== edit.name;
      if (!check3) {
        tips.push('Must not be "all lowercase", read help above');
      }
      const check4 = !edit.name.includes('  ');
      if (!check4) {
        tips.push('Must not have double spaces inside! Please remove those');
      }
      setActionEnabled(tips.length === 0);
      setTipMessages(tips);
      const parsed = getSongDetails(edit.name);
      const changed = { ...edit.editSong, ...parsed };
      setChangeSong(changed);
    }
  }, [edit]);

  if (!edit) {
    return null;
  }

  const { editSong, setHasChanges } = edit;

  return (
    <Modal
      open={activeDialog === 'changeMetadata'}
      size="small"
      dimmer="blurring"
      centered
      onClose={() => setActiveDialog()}>
      <Modal.Header>{i18n.t('ui.edit')}</Modal.Header>
      <Modal.Content>
        <h5>{i18n.t('ui.rename')}</h5>
        <Input
          fluid
          autoFocus
          value={edit.name}
          onChange={(_, { value }) => {
            edit.setName(value);
          }}
        />
        <div style={{ marginTop: 10, marginBottom: 10, color: 'gray' }}>
          {i18n.t('ui.song change name help')}
        </div>
        {tipMessages.length > 0 && <Message warning list={tipMessages} />}
        <h5>{i18n.t('search_title.stage')}</h5>
        <Dropdown
          style={{ marginLeft: 10 }}
          onChange={(_, { value }) => edit.setStage(value as string)}
          selection
          value={edit.stage}
          options={wayStages.map((stage) => {
            return {
              key: stage,
              text: i18n.t(`search_title.${stage}`),
              value: stage,
            };
          })}
        />
        <h5>{i18n.t('screen_title.preview')}</h5>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'row' }}>
          <div style={{ flex: 1, padding: 10 }}>
            <h5>{i18n.t('ui.original song')}</h5>
            {editSong && (
              <SongListItem
                titulo={editSong.titulo}
                fuente={editSong.fuente}
                stage={editSong.stage}
              />
            )}
          </div>
          <div style={{ flex: 1, padding: 10 }}>
            <h5>{i18n.t('ui.patched song')}</h5>
            {changeSong && (
              <SongListItem
                titulo={changeSong.titulo}
                fuente={changeSong.fuente}
                stage={edit.stage}
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
            setHasChanges(true);
            setActiveDialog();
          }}>
          {i18n.t('ui.apply')}
        </Button>
        <Button negative onClick={() => setActiveDialog()}>
          {i18n.t('ui.cancel')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default SongChangeMetadataDialog;
