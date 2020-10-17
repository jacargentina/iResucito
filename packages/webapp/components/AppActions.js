// @flow
import React, { Fragment, useContext } from 'react';
import { signOut } from 'next-auth/client';
import { Portal, Label, Message, Button, Menu } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import I18n from '../../../translations';

const AppActions = () => {
  const data = useContext(DataContext);
  const { user, stats } = data;

  const edit = useContext(EditContext);
  const { confirmLogout } = edit;

  const runLogout = () => {
    confirmLogout(signOut);
  };

  return (
    <>
      <Menu.Item>
        {user}
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
      <Menu.Item>
        <Button negative onClick={runLogout}>
          {I18n.t('ui.logout')}
        </Button>
      </Menu.Item>
    </>
  );
};

export default AppActions;
