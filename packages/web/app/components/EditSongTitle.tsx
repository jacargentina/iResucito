import { useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { EditContext } from './EditContext';
import i18n from '@iresucito/translations';

const EditSongTitle = () => {
  const edit = useContext(EditContext);
  if (!edit) {
    return null;
  }

  const { editSong, songFile, stage } = edit;
  if (!editSong) {
    return null;
  }

  const st =
    stage ||
    editSong.stage ||
    (editSong.stages && editSong.stages[i18n.locale]);
  return (
    <>
      <Menu.Item header>{songFile && songFile.titulo.toUpperCase()}</Menu.Item>
      {songFile && songFile.fuente && <Menu.Item>{songFile.fuente}</Menu.Item>}
      {st && <Menu.Item>{i18n.t(`search_title.${st}`)}</Menu.Item>}
    </>
  );
};

export default EditSongTitle;
