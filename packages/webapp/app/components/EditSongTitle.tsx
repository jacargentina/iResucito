import { useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { EditContext } from './EditContext';
import I18n from '~/translations';

const EditSongTitle = () => {
  const edit = useContext(EditContext);
  if (!edit) {
    return null;
  }

  const { editSong, songFile, stage } = edit;
  if (!editSong) {
    return null;
  }

  const st = stage || editSong.stage || editSong.stages[I18n.locale];
  return (
    <>
      <Menu.Item header>{songFile && songFile.titulo.toUpperCase()}</Menu.Item>
      {songFile && songFile.fuente && <Menu.Item>{songFile.fuente}</Menu.Item>}
      {st && <Menu.Item>{I18n.t(`search_title.${st}`)}</Menu.Item>}
    </>
  );
};

export default EditSongTitle;
