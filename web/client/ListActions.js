// @flow
import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import I18n from '../../translations';

const ListActions = () => {
  const data = useContext(DataContext);
  const { listSongs } = data;

  const edit = useContext(EditContext);
  const { editSong, addSong } = edit;

  if (editSong) {
    return null;
  }

  return (
    <Menu.Item>
      <Button.Group size="mini">
        <Button onClick={listSongs}>
          <Icon name="refresh" />
          {I18n.t('ui.refresh')}
        </Button>
        <Button primary onClick={addSong}>
          <Icon name="add" />
          {I18n.t('ui.create')}
        </Button>
      </Button.Group>
    </Menu.Item>
  );
};

export default ListActions;
