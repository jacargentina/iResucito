// @flow
import React from 'react';
import List from 'semantic-ui-react/dist/commonjs/elements/List';
import Label from 'semantic-ui-react/dist/commonjs/elements/Label';
import I18n from '../../src/translations';
import colors from '../../src/colors';

const SongListItem = (props: any) => {
  const { nombre, fuente, stage } = props;
  return (
    <List>
      <List.Item>
        <List.Content>
          <List.Header>{nombre}</List.Header>
          <List.Description>{fuente}</List.Description>
          {stage && (
            <Label style={{ backgroundColor: colors[stage], marginTop: 10 }}>
              {I18n.t(`search_title.${stage}`)}
            </Label>
          )}
        </List.Content>
      </List.Item>
    </List>
  );
};

export default SongListItem;
