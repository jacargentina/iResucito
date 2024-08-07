import { useState, useEffect, useCallback } from 'react';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import { Button, Modal } from 'semantic-ui-react';
import i18n from '@iresucito/translations';
import { PdfStyles } from '@iresucito/core';
import { useApp } from '~/app.context';

const PdfSettingsDialog = () => {
  const data = useApp();
  const { activeDialog, setActiveDialog, dialogCallback } = data;

  const [initialOptions, setinitialOptions] = useState({});
  const [editing, setEditing] = useState({});

  useEffect(() => {
    if (activeDialog === 'pdfSettings') {
      const savedSettings = localStorage.getItem('pdfStyles');
      if (savedSettings) {
        setinitialOptions(JSON.parse(savedSettings));
      } else {
        setinitialOptions(PdfStyles);
      }
    }
  }, [activeDialog]);

  const saveOptions = useCallback(() => {
    localStorage.setItem('pdfExportOptions', JSON.stringify(editing));
    setActiveDialog();
    if (dialogCallback) {
      dialogCallback();
    }
  }, [dialogCallback]);

  const deleteOptions = useCallback(() => {
    localStorage.removeItem('pdfStyles');
    setinitialOptions(PdfStyles);
    setActiveDialog();
    if (dialogCallback) {
      dialogCallback();
    }
  }, [dialogCallback]);

  return (
    <Modal
      open={activeDialog === 'pdfSettings'}
      dimmer="blurring"
      centered={false}
      onClose={() => setActiveDialog()}>
      <Modal.Header>{i18n.t('screen_title.settings')}</Modal.Header>
      <Modal.Content>
        {activeDialog === 'pdfSettings' && (
          <JSONInput
            id="settingsEditor"
            placeholder={initialOptions}
            onChange={(e: any) => {
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
          {i18n.t('ui.apply')}
        </Button>
        <Button negative onClick={deleteOptions}>
          {i18n.t('ui.delete')}
        </Button>
        <Button onClick={() => setActiveDialog()}>{i18n.t('ui.close')}</Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PdfSettingsDialog;
