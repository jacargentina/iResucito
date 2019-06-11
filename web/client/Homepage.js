// @flow
import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import EditContextWrapper from './EditContext';
import Header from 'semantic-ui-react/dist/commonjs/elements/Header';
import Image from 'semantic-ui-react/dist/commonjs/elements/Image';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import SongChangeMetadataDialog from './SongChangeMetadataDialog';
import PatchLogDialog from './PatchLogDialog';
import PdfSettingsDialog from './PdfSettingsDialog';
import LocalePicker from './LocalePicker';
import Login from './Login';
import SongList from './SongList';
import SongEditor from './SongEditor';
import SongBook from './SongBook';
import ApiMessage from './ApiMessage';
import EditSongTitle from './EditSongTitle';
import AppActions from './AppActions';

const Homepage = () => {
  const data = useContext(DataContext);
  const { user } = data;

  return (
    <div className="container">
      {!user && <Login />}
      {user && (
        <EditContextWrapper>
          <Menu size="mini" inverted attached>
            <Menu.Item header>
              <Image circular src="cristo.png" size="mini" />
              <Header.Content
                style={{ verticalAlign: 'middle', paddingLeft: 10 }}>
                iResucito Web
              </Header.Content>
            </Menu.Item>
            <LocalePicker />
            <EditSongTitle />
            <Menu.Menu position="right">
              <AppActions />
            </Menu.Menu>
          </Menu>
          <ApiMessage />
          <SongList />
          <SongChangeMetadataDialog />
          <PatchLogDialog />
          <PdfSettingsDialog />
          <SongEditor />
          <SongBook />
        </EditContextWrapper>
      )}
    </div>
  );
};

export default Homepage;
