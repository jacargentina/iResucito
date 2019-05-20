// @flow
import React from 'react';
import List from 'semantic-ui-react/dist/commonjs/elements/List';

const SongListItem = (props: any) => {
  const { nombre, fuente } = props;
  return (
    <List.Item>
      <List.Content>
        <List.Header>{nombre}</List.Header>
        <List.Description>{fuente}</List.Description>
      </List.Content>
    </List.Item>
  );
};

export default SongListItem;
