// @flow
import React, { useContext } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { DataContext } from './DataContext';
import I18n from '../../src/translations';

const PatchLogDialog = () => {
  const data = useContext(DataContext);
  const { activeDialog, setActiveDialog, patchLogs } = data;

  return (
    <Modal
      open={activeDialog === 'patchLog'}
      size="large"
      centered={false}
      onClose={() => setActiveDialog()}>
      <Modal.Content>
        <h3>{I18n.t('ui.patch log')}</h3>
        <Grid columns={3} divided>
          {patchLogs &&
            patchLogs.map(item => {
              var detail = '';
              if (item.rename)
                detail += `Renamed from ${item.rename.original} to ${
                  item.rename.new
                }`;
              if (item.linked) detail += `Linked ${item.linked.new}`;
              if (item.created) detail += `created`;
              if (item.updated) detail += `updated`;
              return (
                <Grid.Row key={item.date}>
                  <Grid.Column>{item.author}</Grid.Column>
                  <Grid.Column>{item.date}</Grid.Column>
                  <Grid.Column>
                    <p>{detail}</p>
                  </Grid.Column>
                </Grid.Row>
              );
            })}
        </Grid>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setActiveDialog()}>
          {I18n.t('ui.cancel')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PatchLogDialog;
