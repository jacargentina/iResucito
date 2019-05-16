// @flow
import React, { Fragment, useContext } from 'react';
import { DataContext } from './DataContext';
import { Header, Image, Menu, Button, Message } from 'semantic-ui-react';
import I18n from '../../src/translations';
import LocalePicker from './LocalePicker';
import Login from './Login';
import SongList from './SongList';
import SongEditor from './SongEditor';
import './Homepage.css';

const Homepage = () => {
  const data = useContext(DataContext);
  const {
    editSong,
    hasChanges,
    applyChanges,
    removePatch,
    confirmClose,
    apiError,
    jwt
  } = data;
  return (
    <div className="container">
      <Menu size="small" inverted attached>
        <Menu.Item header>
          <Image circular src="cristo.png" size="mini" />
          <Header.Content style={{ verticalAlign: 'middle', paddingLeft: 10 }}>
            iResucito Web
          </Header.Content>
        </Menu.Item>
        {!editSong && <LocalePicker />}
        {editSong && (
          <Menu.Item header>{editSong.titulo.toUpperCase()}</Menu.Item>
        )}
        {editSong && (
          <Menu.Menu position="right">
            {editSong.patched && (
              <Menu.Item>
                <Button
                  negative
                  floated="right"
                  size="mini"
                  onClick={removePatch}>
                  {I18n.t('ui.remove patch')}
                </Button>
              </Menu.Item>
            )}
            <Menu.Item>
              <Button
                primary
                floated="right"
                size="mini"
                disabled={!hasChanges}
                onClick={applyChanges}>
                {I18n.t('ui.apply')}
              </Button>
            </Menu.Item>
            <Menu.Item>
              <Button floated="right" size="mini" onClick={confirmClose}>
                {I18n.t('ui.cancel')}
              </Button>
            </Menu.Item>
          </Menu.Menu>
        )}
      </Menu>
      {apiError && (
        <Message negative>
          <Message.Header>Ha ocurrido un error</Message.Header>
          <p>{apiError.error}</p>
        </Message>
      )}
      {!jwt && <Login />}
      {jwt && (
        <Fragment>
          {!editSong && <SongList />}
          {editSong && <SongEditor />}
        </Fragment>
      )}
    </div>
  );
};

export default Homepage;
