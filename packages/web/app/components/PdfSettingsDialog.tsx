import { useState, useEffect } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button, Modal } from 'semantic-ui-react';
import I18n from '@iresucito/translations';
import { defaultExportToPdfOptions } from '@iresucito/core/common';
import { useApp } from '~/app.context';

const PdfSettingsDialog = () => {
  const data = useApp();
  const { activeDialog, setActiveDialog, dialogCallback } = data;

  const [initialOptions, setinitialOptions] = useState({});
  const [editing, setEditing] = useState({});

  useEffect(() => {
    if (activeDialog === 'pdfSettings') {
      const savedSettings = localStorage.getItem('pdfExportOptions');
      if (savedSettings) {
        setinitialOptions(JSON.parse(savedSettings));
      } else {
        setinitialOptions(defaultExportToPdfOptions);
      }
    }
  }, [activeDialog]);

  const saveOptions = () => {
    localStorage.setItem('pdfExportOptions', JSON.stringify(editing));
    if (dialogCallback) {
      dialogCallback();
    }
  };

  const deleteOptions = () => {
    localStorage.removeItem('pdfExportOptions');
    setinitialOptions(defaultExportToPdfOptions);
    if (dialogCallback) {
      dialogCallback();
    }
  };

  return (
    <Modal
      open={activeDialog === 'pdfSettings'}
      dimmer="blurring"
      centered={false}
      onClose={() => setActiveDialog()}>
      <Modal.Header>{I18n.t('screen_title.settings')}</Modal.Header>
      <Modal.Content>
        {activeDialog === 'pdfSettings' && (
          <JSONInput
            id="settingsEditor"
            placeholder={initialOptions}
            onChange={(e) => {
              if (!e.error) setEditing(e.jsObject);
            }}
            locale={locale}
            theme="light_mitsuketa_tribute"
            width="100%"
            style={{
              body: { fontSize: '18px' },
              outerBox: { height: '500px' },
              container: { height: '500px' },
            }}
          />
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={saveOptions}>
          {I18n.t('ui.apply')}
        </Button>
        <Button negative onClick={deleteOptions}>
          {I18n.t('ui.delete')}
        </Button>
        <Button onClick={() => setActiveDialog()}>{I18n.t('ui.close')}</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PdfSettingsDialog;
