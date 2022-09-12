import { Modal, Button } from 'semantic-ui-react';
import { useApp } from '~/app.context';
import I18n from '@iresucito/translations';

const ConfirmDialog = () => {
  const app = useApp();
  const { confirmData, setConfirmData } = app;

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
      onClose={() => handleClose(false)}>
      <Modal.Content>
        <h3>{confirmData ? confirmData.message : ''}</h3>
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={() => handleClose(true)}>
          {I18n.t('ui.yes')}
        </Button>
        <Button negative onClick={() => handleClose(false)}>
          {I18n.t('ui.no')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default ConfirmDialog;
