// @flow
import React, { useContext, useState } from 'react';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { DataContext } from './DataContext';
import I18n from '../../translations';
import { defaultExportToPdfSizes } from '../../common';
const merge = require('deepmerge');

const PdfSettingsDialog = () => {
  const data = useContext(DataContext);
  const { activeDialog, setActiveDialog } = data;

  const [sizes, setSizes] = useState(defaultExportToPdfSizes);

  const renderField = (instance: any, field: string, parentField: any) => {
    if (Array.isArray(instance[field])) {
      return instance.map((item, i) => {
        return renderField(item, i);
      });
    }
    if (typeof instance[field] == 'object') {
      return (
        <Form.Field key={field} inline>
          <h3>{field}</h3>
          <Form.Group grouped>
            {renderObjectKeys(instance[field], field)}
          </Form.Group>
        </Form.Field>
      );
    }
    return (
      <Form.Field key={field} inline>
        <label>{field}</label>
        <Input
          size="mini"
          fluid
          value={instance[field]}
          onChange={(e, { value }) => {
            var data = parentField
              ? { [parentField]: { [field]: value } }
              : { [field]: value };
            const result = merge(sizes, data);
            setSizes(result);
          }}
        />
      </Form.Field>
    );
  };

  const renderObjectKeys = (obj, parentField) => {
    return Object.keys(obj).map(field => {
      return renderField(obj, field, parentField);
    });
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
          <Form>{renderObjectKeys(sizes)}</Form>
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
