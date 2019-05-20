// @flow
import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message';
import I18n from '../../src/translations';

const ApiMessage = () => {
  const data = useContext(DataContext);
  const { apiResult } = data;

  if (!apiResult) {
    return null;
  }

  return (
    <Message negative={!!apiResult.error} positive={!!apiResult.ok}>
      <Message.Header>
        {apiResult.error && I18n.t('ui.error ocurred')}
        {apiResult.ok && I18n.t('ui.info message')}
      </Message.Header>
      <p>
        {apiResult.error} {apiResult.ok}
      </p>
    </Message>
  );
};

export default ApiMessage;
