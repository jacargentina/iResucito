import { Header, Image, Menu } from 'semantic-ui-react';
import LocalePicker from './LocalePicker';
import EditSongTitle from './EditSongTitle';
import AppActions from './AppActions';
import { Link } from '@remix-run/react';

const Layout = (props: any) => {
  const { children } = props;

  return (
    <div className="container">
      <Menu size="mini" inverted attached>
        <Link to="/list">
          <Menu.Item header>
            <Image
              circular
              src="/cristo.png"
              size="mini"
              height="35"
              width="35"
            />
            <Header.Content
              style={{ verticalAlign: 'middle', paddingLeft: 10 }}>
              iResucito Web
            </Header.Content>
          </Menu.Item>
        </Link>
        <LocalePicker />
        <EditSongTitle />
        <Menu.Menu position="right">
          <AppActions />
        </Menu.Menu>
      </Menu>
      {children}
    </div>
  );
};

export default Layout;
