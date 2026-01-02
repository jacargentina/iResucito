import { List, ListItem, ListItemText, Chip, Box } from '@mui/material';
import i18n from '@iresucito/translations';
import { colors } from '@iresucito/core';

const SongListItem = (props: any) => {
  const { titulo, fuente, stage } = props;

  return (
    <List disablePadding>
      <ListItem>
        <ListItemText primary={titulo} secondary={fuente} />
        {stage && (
          <Box sx={{ ml: 2 }}>
            <Chip
              label={i18n.t(`search_title.${stage}`)}
              sx={{ backgroundColor: colors[stage], color: 'white' }}
            />
          </Box>
        )}
      </ListItem>
    </List>
  );
};

export default SongListItem;