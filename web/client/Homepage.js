// @flow
import React, { Fragment, useContext } from 'react';
import { DataContext } from './DataContext';
import { Header, Image, Menu, Button, Icon } from 'semantic-ui-react';
import I18n from '../../src/translations';
import LocalePicker from './LocalePicker';
import Login from './Login';
import SongList from './SongList';
import SongEditor from './SongEditor';
import ApiMessage from './ApiMessage';
import './Homepage.css';

const Homepage = () => {
  const data = useContext(DataContext);
  const {
    editSong,
    hasChanges,
    applyChanges,
    confirmRemovePatch,
    confirmClose,
    confirmLogout,
    setActiveDialog,
    user
  } = data;

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
            {editSong && (
              <Fragment>
                <Menu.Item header>{editSong.titulo.toUpperCase()}</Menu.Item>
                <Menu.Item>{editSong.fuente}</Menu.Item>
                <Menu.Item>
                  {I18n.t(`search_title.${editSong.stage}`)}
                </Menu.Item>
                <Menu.Item>
                  <Button primary onClick={() => setActiveDialog('changeName')}>
                    {I18n.t('ui.rename')}
                  </Button>
                </Menu.Item>
                {editSong.patched && (
                  <Menu.Item>
                    <Button negative onClick={confirmRemovePatch}>
                      <Icon name="trash" />
                      {I18n.t('ui.remove patch')}
                    </Button>
                  </Menu.Item>
                )}
                <Menu.Item>
                  <Button primary disabled={!hasChanges} onClick={applyChanges}>
                    {I18n.t('ui.apply')}
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button onClick={confirmClose}>{I18n.t('ui.close')}</Button>
                </Menu.Item>
              </Fragment>
            )}
            <Menu.Menu position="right">
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
