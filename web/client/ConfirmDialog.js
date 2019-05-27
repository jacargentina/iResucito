// @flow
import React, { useContext } from 'react';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import { DataContext } from './DataContext';
import I18n from '../../translations';

const ConfirmDialog = () => {
  const data = useContext(DataContext);
  const { confirmData, setConfirmData } = data;

  const handleClose = (runYesHandler: boolean) => {
    if (runYesHandler === true) {
      confirmData.yes();
    }
    setConfirmData();
  };

  return (
    <Modal
      open={confirmData !== undefined}
      size="small"
      centered={false}
      onClose={handleClose}>
      <Modal.Content>
        <h3>{confirmData ? confirmData.message : ''}</h3>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={() => handleClose(true)}>
          {I18n.t('ui.yes')}
        </Button>
        <Button negative onClick={handleClose}>
          {I18n.t('ui.no')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmDialog;
