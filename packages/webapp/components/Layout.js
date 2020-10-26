// @flow
import React from 'react';
import { Header, Image, Icon, Menu } from 'semantic-ui-react';
import Head from 'next/head';
import LocalePicker from './LocalePicker';
import EditSongTitle from './EditSongTitle';
import AppActions from './AppActions';

declare var IOS_VERSION: string;
declare var ANDROID_VERSION: string;

const Layout = (props: any) => {
  const { title, menu = true, children } = props;

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
            <Menu.Item>
              <Icon name="apple" size="large" />
              {IOS_VERSION}
            </Menu.Item>
            <Menu.Item>
              <Icon name="android" size="large" color="green" />
              {ANDROID_VERSION}
            </Menu.Item>
            <LocalePicker />
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
