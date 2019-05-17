// @flow
import React, { useContext } from 'react';
import { DataContext } from './DataContext';
import { Message } from 'semantic-ui-react';

const ApiMessage = () => {
  const data = useContext(DataContext);
  const { apiResult } = data;

  if (!apiResult) {
    return null;
  }

  return (
    <Message negative={!!apiResult.error} positive={!!apiResult.ok}>
      <Message.Header>
        {apiResult.error && 'Ha ocurrido un error'}
        {apiResult.ok && 'Mensaje informativo'}
      </Message.Header>
      <p>
        {apiResult.error} {apiResult.ok}
      </p>
    </Message>
  );
};

export default ApiMessage;
