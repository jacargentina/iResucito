// @flow
import React, { useContext, useState, useEffect } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import I18n from '../../../translations';
import { defaultExportToPdfOptions } from '../../../common';
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';

const PdfSettingsDialog = () => {
  const data = useContext(DataContext);
  const { activeDialog, setActiveDialog, previewPdf: previewBookPdf } = data;

  const edit = useContext(EditContext);

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
    if (edit && edit.editSong) {
      edit.previewSongPdf();
    } else {
      previewBookPdf();
    }
  };

  const deleteOptions = () => {
    localStorage.removeItem('pdfExportOptions');
    setinitialOptions(defaultExportToPdfOptions);
    if (edit && edit.editSong) {
      edit.previewSongPdf();
    } else {
      previewBookPdf();
    }
  };

  if (!edit) {
    return null;
  }

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
