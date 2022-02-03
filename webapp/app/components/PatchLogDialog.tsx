import { useContext } from 'react';
import { Button, Grid, Modal, Message } from 'semantic-ui-react';
import { EditContext } from './EditContext';
import Loading from './Loading';
import I18n from '~/translations';
import { useApp } from '~/app.context';

const PatchLogDialog = () => {
  const app = useApp();
  const { activeDialog, setActiveDialog } = app;
  const edit = useContext(EditContext);
  if (!edit) {
    return null;
  }

  const { editSong, patchLogs } = edit;

  console.log(patchLogs);

  return (
    <Modal
      open={activeDialog === 'patchLog'}
      size="large"
      dimmer="blurring"
      centered={false}
      onClose={() => setActiveDialog()}>
      <Modal.Header>{I18n.t('ui.patch log')}</Modal.Header>
      <Modal.Content>
        {editSong && <h5>{editSong.titulo.toUpperCase()}</h5>}
        <Loading height="auto">
          <div style={{ flex: 1 }}>
            {patchLogs &&
              patchLogs.changes.length === 0 &&
              !patchLogs.pending && (
                <Message>{I18n.t('ui.no items to show')}</Message>
              )}
            {patchLogs && patchLogs.changes.length > 0 && (
              <Grid columns={3} divided celled>
                <Grid.Row color="black" style={{ fontWeight: 'bold' }}>
                  <Grid.Column width={4} style={{ overflow: 'hidden' }}>
                    User
                  </Grid.Column>
                  <Grid.Column width={3} style={{ overflow: 'hidden' }}>
                    Date
                  </Grid.Column>
                  <Grid.Column width={9} style={{ overflow: 'hidden' }}>
                    Changes
                  </Grid.Column>
                </Grid.Row>
                {patchLogs.changes.map((item) => {
                  var detail = [];
                  if (item.created) detail.push('Created');
                  if (item.rename)
                    detail.push(
                      `Renamed from ${item.rename.original} to ${item.rename.new}`
                    );
                  if (item.linked) detail.push(`Linked ${item.linked.new}`);
                  if (item.updated) detail.push('Updated text');
                  if (item.staged)
                    detail.push(
                      `Staged from ${item.staged.original} to ${item.staged.new}`
                    );
                  return (
                    <Grid.Row key={item.date}>
                      <Grid.Column width={4} style={{ overflow: 'hidden' }}>
                        {item.author}
                      </Grid.Column>
                      <Grid.Column width={3} style={{ overflow: 'hidden' }}>
                        {new Date(item.date).toLocaleString()}
                      </Grid.Column>
                      <Grid.Column width={9} style={{ overflow: 'hidden' }}>
                        <Message list={detail} />
                      </Grid.Column>
                    </Grid.Row>
                  );
                })}
              </Grid>
            )}
            {patchLogs && patchLogs.pending && (
              <Message
                warning
                list={[
                  I18n.t('ui.patch pending', {
                    author: patchLogs.pending.author,
                    date: new Date(patchLogs.pending.date).toLocaleString(),
                  }),
                ]}
              />
            )}
          </div>
        </Loading>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setActiveDialog()}>
          {I18n.t('ui.close')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PatchLogDialog;
