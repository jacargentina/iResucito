import { Header, Image, Menu } from 'semantic-ui-react';
import LocalePicker from './LocalePicker';
import EditSongTitle from './EditSongTitle';
import AppActions from './AppActions';
import { Link } from 'remix';

const Layout = (props: any) => {
  const { menu = true, children } = props;

  return (
    <div className="container">
      {menu && (
        <Menu size="mini" inverted attached>
          <Link to="/">
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
      )}
      {children}
    </div>
  );
};

export default Layout;
