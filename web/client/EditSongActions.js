// @flow
import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import I18n from '../../translations';

const EditSongActions = () => {
  const data = useContext(DataContext);
  const { setActiveDialog } = data;

  const edit = useContext(EditContext);
  const {
    editSong,
    confirmRemovePatch,
    hasChanges,
    applyChanges,
    confirmClose
  } = edit;

  if (!editSong) {
    return null;
  }

  return (
    <Menu.Item>
      <Button.Group size="mini">
        <Button primary onClick={() => setActiveDialog('changeMetadata')}>
          {I18n.t('ui.edit')}
        </Button>
        {editSong.patched && (
          <Button negative onClick={confirmRemovePatch}>
            <Icon name="trash" />
            {I18n.t('ui.remove patch')}
          </Button>
        )}
        <Button primary onClick={() => setActiveDialog('patchLog')}>
          {I18n.t('ui.patch log')}
        </Button>
        <Button positive disabled={!hasChanges} onClick={applyChanges}>
          {I18n.t('ui.apply')}
        </Button>
        <Button onClick={confirmClose}>{I18n.t('ui.close')}</Button>
      </Button.Group>
    </Menu.Item>
  );
};

export default EditSongActions;
