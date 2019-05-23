// @flow
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { DataContext } from './DataContext';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import I18n from '../../src/translations';
import LocalePicker from './LocalePicker';
import Login from './Login';
import SongList from './SongList';
import SongEditor from './SongEditor';
import ApiMessage from './ApiMessage';
import { getPropertyLocale } from '../../src/common';

const Homepage = () => {
  const data = useContext(DataContext);
  const {
    locale,
    editSong,
    addSong,
    songFile,
    hasChanges,
    applyChanges,
    confirmRemovePatch,
    confirmClose,
    confirmLogout,
    setActiveDialog,
    user,
    songs
  } = data;

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

  return (
    <div className="container">
      {!user && <Login />}
      {user && (
        <Fragment>
          <Menu size="mini" inverted attached>
            <Menu.Item header>
              <Image circular src="cristo.png" size="mini" />
              <Header.Content
                style={{ verticalAlign: 'middle', paddingLeft: 10 }}>
                iResucito Web
              </Header.Content>
            </Menu.Item>
            {!editSong && <LocalePicker />}
            {!editSong && resume && (
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
                    width: '340px',
                    backgroundColor: 'gray'
                  }}
                />
              </Menu.Item>
            )}
            {editSong && (
              <Fragment>
                <Menu.Item header>
                  {songFile && songFile.titulo.toUpperCase()}
                </Menu.Item>
                {songFile && songFile.fuente && (
                  <Menu.Item>{songFile.fuente}</Menu.Item>
                )}
                {editSong.stage && (
                  <Menu.Item>
                    {I18n.t(`search_title.${editSong.stage}`)}
                  </Menu.Item>
                )}
                <Menu.Item>
                  <Button primary onClick={() => setActiveDialog('patchLog')}>
                    {I18n.t('ui.patch log')}
                  </Button>
                </Menu.Item>
              </Fragment>
            )}
            <Menu.Menu position="right">
              {editSong && (
                <Menu.Item>
                  <Button primary onClick={() => setActiveDialog('changeName')}>
                    {I18n.t('ui.rename')}
                  </Button>
                </Menu.Item>
              )}
              {editSong && editSong.patched && (
                <Menu.Item>
                  <Button negative onClick={confirmRemovePatch}>
                    <Icon name="trash" />
                    {I18n.t('ui.remove patch')}
                  </Button>
                </Menu.Item>
              )}
              {editSong && (
                <Fragment>
                  <Menu.Item>
                    <Button
                      primary
                      disabled={!hasChanges}
                      onClick={applyChanges}>
                      {I18n.t('ui.apply')}
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Button onClick={confirmClose}>{I18n.t('ui.close')}</Button>
                  </Menu.Item>
                </Fragment>
              )}
              {!editSong && (
                <Menu.Item>
                  <Button primary onClick={addSong}>
                    <Icon name="add" />
                    {I18n.t('ui.create')}
                  </Button>
                </Menu.Item>
              )}
              <Menu.Item>{user}</Menu.Item>
              <Menu.Item>
                <Button negative onClick={confirmLogout}>
                  {I18n.t('ui.logout')}
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <ApiMessage />
          {!editSong && <SongList />}
          {editSong && <SongEditor />}
        </Fragment>
      )}
    </div>
  );
};

export default Homepage;
