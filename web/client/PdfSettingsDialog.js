// @flow
import React, { useContext, useState } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { DataContext } from './DataContext';
import I18n from '../../translations';
import { defaultExportToPdfOptions } from '../../common';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const PdfSettingsDialog = () => {
  const data = useContext(DataContext);
  const { activeDialog, setActiveDialog } = data;

  const [sizes, setSizes] = useState(defaultExportToPdfOptions);

  return (
    <Modal
      open={activeDialog === 'pdfSettings'}
      size="large"
      dimmer="blurring"
      centered={false}
      onClose={() => setActiveDialog()}>
      <Modal.Header>{I18n.t('screen_title.settings')}</Modal.Header>
      <Modal.Content>
        {activeDialog === 'pdfSettings' && (
          <JSONInput
            id="a_unique_id"
            placeholder={sizes}
            locale={locale}
            theme="light_mitsuketa_tribute"
            width="100%"
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setActiveDialog()}>
          {I18n.t('ui.close')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PdfSettingsDialog;
