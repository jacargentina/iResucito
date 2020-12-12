// @flow
import React from 'react';
import { Header, Image, Menu } from 'semantic-ui-react';
import Head from 'next/head';
import LocalePicker from './LocalePicker';
import EditSongTitle from './EditSongTitle';
import AppActions from './AppActions';

const Layout = (props: any) => {
  const { title, menu = true, locale, children } = props;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="container">
        {menu && (
          <Menu size="mini" inverted attached>
            <Menu.Item header>
              <Image circular src="/cristo.png" size="mini" />
              <Header.Content
                style={{ verticalAlign: 'middle', paddingLeft: 10 }}>
                iResucito Web
              </Header.Content>
            </Menu.Item>
            <LocalePicker current={locale} />
            <EditSongTitle />
            <Menu.Menu position="right">
              <AppActions />
            </Menu.Menu>
          </Menu>
        )}
        {children}
      </div>
    </>
  );
};

export default Layout;
