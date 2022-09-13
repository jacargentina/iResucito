import { List, Label } from 'semantic-ui-react';
import I18n from '@iresucito/translations';
import { colors}  from '@iresucito/core';

const SongListItem = (props: any) => {
  const { titulo, fuente, stage } = props;
  return (
    <List>
      <List.Item>
        <List.Content>
          <List.Header>{titulo}</List.Header>
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
