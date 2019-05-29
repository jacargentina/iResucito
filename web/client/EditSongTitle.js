// @flow
import React, { Fragment, useContext } from 'react';
import { EditContext } from './EditContext';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import I18n from '../../translations';

const EditSongTitle = () => {
  const edit = useContext(EditContext);
  const { editSong, songFile, stage } = edit;

  if (!editSong) {
    return null;
  }

  return (
    <Fragment>
      <Menu.Item header>{songFile && songFile.titulo.toUpperCase()}</Menu.Item>
      {songFile && songFile.fuente && <Menu.Item>{songFile.fuente}</Menu.Item>}
      <Menu.Item>{I18n.t(`search_title.${stage || editSong.stage}`)}</Menu.Item>
    </Fragment>
  );
};

export default EditSongTitle;
