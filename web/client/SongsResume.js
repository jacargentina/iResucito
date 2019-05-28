// @flow
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress';
import I18n from '../../translations';
import { getPropertyLocale } from '../../common';

const SongsResume = () => {
  const data = useContext(DataContext);
  const { locale, songs } = data;

  const edit = useContext(EditContext);
  const { editSong } = edit;
  const [resume, setResume] = useState();

  useEffect(() => {
    if (songs) {
      const withLocale = songs.filter(song => {
        return song.patched || !!getPropertyLocale(song.files, locale);
      });
      var result = { translated: withLocale.length, total: songs.length };
      setResume({
        text: I18n.t('ui.translated songs', result),
        values: result
      });
    } else {
      setResume();
    }
  }, [songs]);

  if (editSong || !resume) {
    return null;
  }

  return (
    <Menu.Item>
      {resume.text}
      <Progress
        total={resume.values.total}
        value={resume.values.translated}
        progress="percent"
        inverted
        precision={2}
        success
        style={{
          marginLeft: '40px',
          marginTop: 'auto',
          marginBottom: 'auto',
          width: '250px',
          backgroundColor: 'gray'
        }}
      />
    </Menu.Item>
  );
};

export default SongsResume;
