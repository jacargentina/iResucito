// @flow
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { DataContext } from './DataContext';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Segment from 'semantic-ui-react/dist/commonjs/elements/Segment';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Progress from 'semantic-ui-react/dist/commonjs/modules/Progress';
import Portal from 'semantic-ui-react/dist/commonjs/addons/Portal';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
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
    stats,
    editSong,
    addSong,
    listSongs,
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

  const showStats = () => {};

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
                    width: '250px',
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
              </Fragment>
            )}
            <Menu.Menu position="right">
              {editSong && (
                <Menu.Item>
                  <Button.Group size="mini">
                    <Button
                      primary
                      onClick={() => setActiveDialog('changeMetadata')}>
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
                    <Button
                      positive
                      disabled={!hasChanges}
                      onClick={applyChanges}>
                      {I18n.t('ui.apply')}
                    </Button>
                    <Button onClick={confirmClose}>{I18n.t('ui.close')}</Button>
                  </Button.Group>
                </Menu.Item>
              )}
              {!editSong && (
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
              )}
              <Menu.Item>
                {user}
                {stats && stats.length > 0 && (
                  <Portal
                    closeOnTriggerClick
                    openOnTriggerClick
                    trigger={
                      <Label color="red" onClick={showStats}>
                        {stats.length}
                      </Label>
                    }>
                    <div
                      style={{
                        position: 'fixed',
                        zIndex: 9999,
                        top: 54,
                        right: 0
                      }}>
                      <Message
                        header={I18n.t('ui.changes since last login')}
                        list={stats}
                        color="blue"
                      />
                    </div>
                  </Portal>
                )}
              </Menu.Item>
              <Menu.Item>
                <Button negative onClick={confirmLogout}>
                  {I18n.t('ui.logout')}
                </Button>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
          <ApiMessage />
          <SongList />
          {editSong && <SongEditor />}
        </Fragment>
      )}
    </div>
  );
};

export default Homepage;
