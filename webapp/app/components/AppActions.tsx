import { useFetcher, useNavigate } from 'remix';
import { useContext, useState } from 'react';
import { Button, Menu, Icon, Modal, Label } from 'semantic-ui-react';
import { useApp } from '~/app.context';
import { EditContext } from './EditContext';
import I18n from '~/translations';
import collaborators from '~/songs/collaborators.json';

const AppActions = () => {
  const app = useApp();
  const edit = useContext(EditContext);
  const [aboutVisible, setAboutVisible] = useState(false);
  const navigate = useNavigate();
  const fetcher = useFetcher();

  const { setConfirmData } = app;

  const confirmLogout = () => {
    if (edit && edit.hasChanges) {
      setConfirmData({
        message: I18n.t('ui.discard confirmation'),
        yes: () => {
          fetcher.submit(null, {
            action: `/logout`,
            method: 'post',
          });
        },
      });
    } else {
      fetcher.submit(null, {
        action: `/logout`,
        method: 'post',
      });
    }
  };

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
                  {app.ios_version}
                  <Icon name="android" size="large" color="green" />
                  {app.android_version}
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
                {app.patchStats && app.patchStats.length > 0 && (
                  <>
                    <h3>{I18n.t('ui.statistics')}</h3>
                    <p>{I18n.t('ui.changes pending of publish')}</p>
                  </>
                )}
                {app.patchStats &&
                  app.patchStats.map((localeStats) => {
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
      {app.user ? (
        <>
          <Menu.Item>
            <Button negative onClick={confirmLogout}>
              {I18n.t('ui.logout')}
            </Button>
          </Menu.Item>
          <Menu.Item>
            <Button onClick={() => navigate('/account')}>
              {I18n.t('ui.account')}
            </Button>
          </Menu.Item>
        </>
      ) : null}
      {!app.user && (
        <Menu.Item>
          <Button primary onClick={() => navigate('/account')}>
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
