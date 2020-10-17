// @flow
import React, { useContext } from 'react';
import { Message } from 'semantic-ui-react';
import { DataContext } from './DataContext';
import I18n from '../../../translations';

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
