// @flow
import React, { Fragment, useContext } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/client';
import { Portal, Label, Message, Button, Menu } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import I18n from '../../../translations';

const AppActions = () => {
  const data = useContext(DataContext);
  const edit = useContext(EditContext);
  const router = useRouter();
  const { user, stats, setConfirmData } = data;

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

  return (
    <>
      {user && (
        <Menu.Item>
          {stats && stats.length > 0 && (
            <Portal
              closeOnTriggerClick
              openOnTriggerClick
              trigger={<Label color="red">{stats.length}</Label>}>
              <div
                style={{
                  position: 'fixed',
                  zIndex: 9999,
                  top: 54,
                  right: 0,
                }}>
                <Message
                  header={I18n.t('ui.changes since last login')}
                  list={stats.map((stat) => {
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
      {user && (
        <Menu.Item>
          <Button negative onClick={confirmLogout}>
            {I18n.t('ui.logout')}
          </Button>
        </Menu.Item>
      )}
      {!user && (
        <Menu.Item>
          <Button primary onClick={() => router.replace('/login')}>
            {I18n.t('ui.login')}
          </Button>
        </Menu.Item>
      )}
    </>
  );
};

export default AppActions;
