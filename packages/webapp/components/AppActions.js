// @flow
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';
import {
  Portal,
  Label,
  Message,
  Button,
  Menu,
  Icon,
  Modal,
} from 'semantic-ui-react';
import * as axios from 'axios';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import I18n from '../../../translations';

declare var IOS_VERSION: string;
declare var ANDROID_VERSION: string;

const collaborators = require('../../../songs/collaborators.json');

const AppActions = () => {
  const [session, isLoading] = useSession();
  const data = useContext(DataContext);
  const edit = useContext(EditContext);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [patchStats, setPatchStats] = useState();
  const router = useRouter();

  const { setConfirmData } = data;

  const confirmLogout = () => {
    if (edit && edit.hasChanges) {
      setConfirmData({
        message: I18n.t('ui.discard confirmation'),
        yes: () => {
          signOut({ callbackUrl: '/' });
        },
      });
    } else {
      signOut({ callbackUrl: '/' });
    }
  };

  useEffect(() => {
    return axios
      .get(`/api/patches/stats`)
      .then((result) => {
        setPatchStats(result.data);
      })
      .catch((err) => {
        consolistics.log('stats err: ', err);
      });
  }, []);

  return (
    <>
      {aboutVisible && (
        <Modal
          centered={false}
          closeIcon
          open={aboutVisible}
          onClose={() => setAboutVisible(false)}
          size="large">
          <Modal.Header>iResucito Web</Modal.Header>
          <Modal.Content>
            <div style={{ display: 'flex' }}>
              <img src="/cristo.jpg" width="200" height="300" alt="Cristo" />
              <div style={{ flex: 1, marginLeft: 20 }}>
                <div>
                  <Icon name="apple" size="large" />
                  {IOS_VERSION}
                  <Icon name="android" size="large" color="green" />
                  {ANDROID_VERSION}
                </div>
                &nbsp;
                <div>
                  <h3>{I18n.t('ui.collaborators')}</h3>
                  <ul>
                    {Object.keys(collaborators).map((lang) => {
                      return (
                        <li>{`${collaborators[lang].join(', ')} (${lang})`}</li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div style={{ flex: 1, marginLeft: 20 }}>
                <h3>{I18n.t('ui.statistics')}</h3>
                {patchStats &&
                  patchStats.map((localeStats) => {
                    return (
                      <>
                        <h4>
                          {localeStats.locale} ({localeStats.count} changes)
                        </h4>
                        <ul>
                          {localeStats.items.map((stat) => {
                            return (
                              <li>
                                {I18n.t('ui.changed songs by author', {
                                  ...stat,
                                })}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    );
                  })}
              </div>
            </div>
          </Modal.Content>
        </Modal>
      )}
      {!isLoading && session && session.stats && session.stats.length > 0 && (
        <Menu.Item>
          {session.stats.length > 0 && (
            <Portal
              closeOnTriggerClick
              openOnTriggerClick
              trigger={<Label color="red">{session.stats.length}</Label>}>
              <div
                style={{
                  position: 'fixed',
                  zIndex: 9999,
                  top: 54,
                  right: 0,
                }}>
                <Message
                  header={I18n.t('ui.changes since last login')}
                  list={session.stats.map((stat) => {
                    return I18n.t('ui.changed songs by author', {
                      ...stat,
                    });
                  })}
                  color="blue"
                />
              </div>
            </Portal>
          )}
        </Menu.Item>
      )}
      {!isLoading && session && session.user ? (
        <Menu.Item>
          <Button negative onClick={confirmLogout}>
            {I18n.t('ui.logout')}
          </Button>
        </Menu.Item>
      ) : null}
      {!isLoading && !session && (
        <Menu.Item>
          <Button
            primary
            onClick={() => router.replace('/login?callbackUrl=/')}>
            {I18n.t('ui.login')}
          </Button>
        </Menu.Item>
      )}
      <Menu.Item>
        <Button onClick={() => setAboutVisible(true)}>
          <Icon name="help" />
          {I18n.t('settings_title.about')}
        </Button>
      </Menu.Item>
    </>
  );
};

export default AppActions;
