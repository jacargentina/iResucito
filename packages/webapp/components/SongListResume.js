// @flow
import React, { useEffect, useState } from 'react';
import { Menu, Progress } from 'semantic-ui-react';
import I18n from '../../../translations';
import { getPropertyLocale } from '../../../common';

const emptyResume = {
  text: '-',
  values: { total: 0, translated: 0 },
};

const SongListResume = (props: any) => {
  const { songs } = props;
  const [resume, setResume] = useState(emptyResume);

  useEffect(() => {
    if (songs) {
      const withLocale = songs.filter((song) => {
        return song.patched || !!getPropertyLocale(song.files, I18n.locale);
      });
      const result = { translated: withLocale.length, total: songs.length };
      setResume({
        text: I18n.t('ui.translated songs', result),
        values: result,
      });
    } else {
      setResume(emptyResume);
    }
  }, [songs]);

  return (
    <Menu.Item position="right">
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
          backgroundColor: 'gray',
        }}
      />
    </Menu.Item>
  );
};

export default SongListResume;
