import { useMemo, useState } from 'react';
import { Menu, MenuItem, Box, Typography } from '@mui/material';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';
import {
  getLocalesForPicker,
  getValidatedLocale,
  PickerLocale,
} from '@iresucito/core';

const LocalePicker = () => {
  const app = useApp();
  const { patchStats } = app;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const availableLocales = useMemo<PickerLocale[]>(() => {
    return getLocalesForPicker(app.locale);
  }, []);

  const current = useMemo<PickerLocale | undefined>(() => {
    return getValidatedLocale(availableLocales, app.locale);
  }, [app.locale]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLocaleSelect = (locale: PickerLocale) => {
    app.changeLanguage(locale);
    handleClose();
  };

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          ml: 1,
          p: 1,
          cursor:  'pointer',
          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        }}>
        <Typography variant="body2" sx={{ color: 'white' }}>
          {i18n.t('settings_title.locale', { locale: app.locale })} (
          {app.locale})
        </Typography>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {availableLocales.map((item) => {
          const stat = patchStats.find((st) => st.locale == item. value);
          return (
            <MenuItem
              key={item.value}
              onClick={() => handleLocaleSelect(item)}
              selected={app.locale === item.value}>
              {item.label} - {item.value} {stat ? `(${stat?.count})` : null}
            </MenuItem>
          );
        })}
      </Menu>
      {current && (
        <Typography variant="body2" sx={{ ml: 1, p: 1, color: 'white' }}>
          {current.label}
        </Typography>
      )}
    </>
  );
};

export default LocalePicker;