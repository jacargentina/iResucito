// @flow
import React, { Fragment, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/client';
import { Button, Menu, Icon, Modal, Label } from 'semantic-ui-react';
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
        console.log('stats err: ', err);
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
                    {Object.keys(collaborators).map((lang, idx) => {
                      return (
                        <li key={idx}>{`${collaborators[lang].join(
                          ', '
                        )} (${lang})`}</li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div style={{ flex: 1, marginLeft: 20 }}>
                {patchStats && patchStats.length > 0 && (
                  <>
                    <h3>{I18n.t('ui.statistics')}</h3>
                    <p>{I18n.t('ui.changes pending of publish')}</p>
                  </>
                )}
                {patchStats &&
                  patchStats.map((localeStats) => {
                    return (
                      <>
                        <h4>
                          <Label color="green">
                            {localeStats.locale} ({localeStats.count} changes)
                          </Label>
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
      {!isLoading && session && session.user ? (
        <>
          <Menu.Item>
            <Button negative onClick={confirmLogout}>
              {I18n.t('ui.logout')}
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button onClick={() => router.push('/account')}>
              {I18n.t('ui.account')}
            </Button>
          </Menu.Item>
        </>
      ) : null}
      {!isLoading && !session && (
        <Menu.Item>
          <Button
            primary
            onClick={() => router.replace('/account?callbackUrl=/')}>
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
