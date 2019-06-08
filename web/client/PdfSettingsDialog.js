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

  const [opts, setopts] = useState(defaultExportToPdfOptions);

  const saveOptions = () => {
    //TODO
  };

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
            placeholder={opts}
            onChange={e => setopts(e.json)}
            locale={locale}
            theme="light_mitsuketa_tribute"
            width="100%"
            style={{ body: { fontSize: '18px' } }}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={saveOptions}>
          {I18n.t('ui.apply')}
        </Button>
        <Button negative onClick={() => setActiveDialog()}>
          {I18n.t('ui.close')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PdfSettingsDialog;
