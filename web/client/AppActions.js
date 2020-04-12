// @flow
import React, { Fragment, useContext } from 'react';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import Portal from 'semantic-ui-react/dist/commonjs/addons/Portal';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import I18n from '../../translations';

const AppActions = () => {
  const data = useContext(DataContext);
  const { user, stats, logout } = data;

  const edit = useContext(EditContext);
  const { confirmLogout } = edit;

  const runLogout = () => {
    confirmLogout(logout);
  };

  return (
    <Fragment>
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
    </Fragment>
  );
};

export default AppActions;
