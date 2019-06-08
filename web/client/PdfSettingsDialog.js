// @flow
import React, { useContext, useState } from 'react';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Input from 'semantic-ui-react/dist/commonjs/elements/Input';
import Checkbox from 'semantic-ui-react/dist/commonjs/modules/Checkbox';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal';
import { DataContext } from './DataContext';
import I18n from '../../translations';
import { defaultExportToPdfSizes } from '../../common';
const merge = require('deepmerge');

const PdfSettingsDialog = () => {
  const data = useContext(DataContext);
  const { activeDialog, setActiveDialog } = data;

  const [useTimesNewRoman, setUseTimesNewRoman] = useState(false);
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

  var column1 = [
    <Form.Field key={0}>
      <label>Use Times New Roman font</label>
      <Checkbox
        toggle
        checked={useTimesNewRoman}
        onChange={() => setUseTimesNewRoman(s => !s)}
      />
    </Form.Field>,
    ...renderObjectKeys(sizes)
  ];

  const column2 = column1.splice(column1.length / 2);

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
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <Form>{column1}</Form>
              </Grid.Column>
              <Grid.Column width={8}>
                <Form>{column2}</Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
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
