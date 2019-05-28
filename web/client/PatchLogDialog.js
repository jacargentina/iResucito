// @flow
import React, { useContext } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import Loading from './Loading';
import I18n from '../../translations';

const PatchLogDialog = () => {
  const data = useContext(DataContext);
  const { activeDialog, setActiveDialog } = data;

  const edit = useContext(EditContext);
  const { editSong, patchLogs } = edit;

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
            {patchLogs && patchLogs.length === 0 && (
              <Message>{I18n.t('ui.no items to show')}</Message>
            )}
            {patchLogs && patchLogs.length > 0 && (
              <Grid columns={3} divided celled>
                <Grid.Row color="black" style={{ fontWeight: 'bold' }}>
                  <Grid.Column width={3}>User</Grid.Column>
                  <Grid.Column width={3}>Date</Grid.Column>
                  <Grid.Column width={10}>Changes</Grid.Column>
                </Grid.Row>
                {patchLogs.map(item => {
                  var detail = [];
                  if (item.created) detail.push('Created');
                  if (item.rename)
                    detail.push(
                      `Renamed from ${item.rename.original} to ${
                        item.rename.new
                      }`
                    );
                  if (item.linked) detail.push(`Linked ${item.linked.new}`);
                  if (item.updated) detail.push('Updated text');
                  return (
                    <Grid.Row key={item.date}>
                      <Grid.Column width={3}>{item.author}</Grid.Column>
                      <Grid.Column width={3}>
                        {new Date(item.date).toLocaleString()}
                      </Grid.Column>
                      <Grid.Column width={10}>
                        <Message list={detail} />
                      </Grid.Column>
                    </Grid.Row>
                  );
                })}
              </Grid>
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
