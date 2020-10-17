// @flow
import React from 'react';
import { Message } from 'semantic-ui-react';

const ErrorDetail = (props: any) => {
  const message = props.error.message;
  const detail = <pre>{JSON.stringify(props.error, null, 2)}</pre>;
  return (
    <Message negative>
      <Message.Header>Error</Message.Header>
      <p>{message}</p>
      {!props.simple && <div>{detail}</div>}
    </Message>
  );
};

export default ErrorDetail;
