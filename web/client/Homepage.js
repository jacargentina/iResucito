// @flow
import React, { useContext } from 'react';
import SongList from './SongList';
import SongEditor from './SongEditor';
import { DataContext } from './DataContext';
import { Header, Segment, Image } from 'semantic-ui-react';
import LocalePicker from './LocalePicker';
import './Homepage.css';

const Homepage = () => {
  const data = useContext(DataContext);
  const { editSong } = data;
  return (
    <div className="container">
      <Segment inverted basic>
        <Header>
          <Image src="cristo.png" />
          <Header.Content style={{ verticalAlign: 'middle' }}>
            iResucito Web
          </Header.Content>
          <LocalePicker enabled={!editSong} />
        </Header>
      </Segment>
      {!editSong && <SongList />}
      {editSong && <SongEditor />}
    </div>
  );
};

export default Homepage;
