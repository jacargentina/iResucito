import { useEffect, useState } from 'react';
import { Menu, Progress } from 'semantic-ui-react';
import i18n from '@iresucito/translations';
import { getPropertyLocale, Song } from '@iresucito/core';

const emptyResume = {
  text: '-',
  values: { total: 0, translated: 0 },
};

const SongListResume = (props: any) => {
  const { songs } = props;
  const [resume, setResume] = useState(emptyResume);

  useEffect(() => {
    if (songs) {
      const withLocale = songs.filter((song: Song) => {
        return song.patched || !!getPropertyLocale(song.files, i18n.locale);
      });
      const result = { translated: withLocale.length, total: songs.length };
      setResume({
        text: i18n.t('ui.translated songs', result),
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
