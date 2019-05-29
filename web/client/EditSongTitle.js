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

  const st = stage || editSong.stage || editSong.stages[I18n.locale];

  return (
    <Fragment>
      <Menu.Item header>{songFile && songFile.titulo.toUpperCase()}</Menu.Item>
      {songFile && songFile.fuente && <Menu.Item>{songFile.fuente}</Menu.Item>}
      {st && <Menu.Item>{I18n.t(`search_title.${st}`)}</Menu.Item>}
    </Fragment>
  );
};

export default EditSongTitle;
