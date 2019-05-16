// @flow
import React, { useContext } from 'react';
import SongList from './SongList';
import SongEditor from './SongEditor';
import { DataContext } from './DataContext';
import { Header, Image, Menu, Button } from 'semantic-ui-react';
import I18n from '../../src/translations';
import LocalePicker from './LocalePicker';
import './Homepage.css';

const Homepage = () => {
  const data = useContext(DataContext);
  const {
    editSong,
    hasChanges,
    applyChanges,
    removePatch,
    confirmClose
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
      {!editSong && <SongList />}
      {editSong && <SongEditor />}
    </div>
  );
};

export default Homepage;
