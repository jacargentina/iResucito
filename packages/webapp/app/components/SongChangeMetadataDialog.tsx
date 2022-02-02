import { useContext, useState, useEffect } from 'react';
import { Button, Input, Message, Modal, Dropdown } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import SongListItem from './SongListItem';
import { getSongFileFromString } from '~/SongsProcessor';
import { wayStages } from '~/common';
import I18n from '~/translations';

const SongChangeMetadataDialog = () => {
  const data = useContext(DataContext);
  const { activeDialog, setActiveDialog } = data;

  const edit = useContext(EditContext);

  const [actionEnabled, setActionEnabled] = useState(false);
  const [tipMessages, setTipMessages] = useState([]);
  const [changeSong, setChangeSong] = useState();

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
      const parsed = getSongFileFromString(edit.name);
      const changed = { ...edit.editSong, ...parsed };
      setChangeSong(changed);
    }
  }, [edit.name, edit]);

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
      <Modal.Header>{I18n.t('ui.edit')}</Modal.Header>
      <Modal.Content>
        <h5>{I18n.t('ui.rename')}</h5>
        <Input
          fluid
          autoFocus
          value={edit.name}
          onChange={(e, { value }) => {
            edit.setName(value);
          }}
        />
        <div style={{ marginTop: 10, marginBottom: 10, color: 'gray' }}>
          {I18n.t('ui.song change name help')}
        </div>
        {tipMessages.length > 0 && <Message warning list={tipMessages} />}
        <h5>{I18n.t('search_title.stage')}</h5>
        <Dropdown
          style={{ marginLeft: 10 }}
          onChange={(e, { value }) => edit.setStage(value)}
          selection
          value={edit.stage}
          options={wayStages.map((stage) => {
            return {
              key: stage,
              text: I18n.t(`search_title.${stage}`),
              value: stage,
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
                stage={edit.stage}
              />
            )}
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          isDisabled={!actionEnabled}
          onClick={() => {
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
