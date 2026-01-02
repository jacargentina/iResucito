import { useContext, useState } from 'react';
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Apple as AppleIcon,
  Android as AndroidIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useApp } from '~/app.context';
import { EditContext } from './EditContext';
import i18n from '@iresucito/translations';
import { CollaboratorsIndex } from '@iresucito/core';
import { useNavigate, useSubmit } from '@remix-run/react';

const AppActions = () => {
  const app = useApp();
  const edit = useContext(EditContext);
  const [aboutVisible, setAboutVisible] = useState(false);
  const navigate = useNavigate();
  const submit = useSubmit();

  const { setConfirmData } = app;

  const confirmLogout = () => {
    if (edit && edit.hasChanges) {
      setConfirmData({
        message: i18n.t('ui.discard confirmation'),
        yes: () => {
          submit(null, {
            action: `/logout`,
            method: 'post',
          });
        },
      });
    } else {
      submit(null, {
        action: `/logout`,
        method: 'post',
      });
    }
  };

  return (
    <>
      <Dialog
        open={aboutVisible}
        maxWidth="md"
        fullWidth
        onClose={() => setAboutVisible(false)}>
        <DialogTitle>iResucito Web</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Box
                component="img"
                src="/cristo.jpg"
                sx={{ width: '100%', maxWidth: 200 }}
                alt="Cristo"
              />
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <AppleIcon fontSize="large" />
                <AndroidIcon fontSize="large" sx={{ color: 'green' }} />
              </Box>
              <Typography variant="body2">{app.expo_version}</Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                {i18n.t('ui.collaborators')}
              </Typography>
              <List dense>
                {Object.keys(CollaboratorsIndex).map((lang) => (
                  <ListItem key={lang} disableGutters>
                    <ListItemText
                      primary={`${CollaboratorsIndex[
                        lang as keyof typeof CollaboratorsIndex
                      ].join(', ')} (${lang})`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item xs={12} sm={4}>
              {app.patchStats && app.patchStats.length > 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    {i18n.t('ui.statistics')}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {i18n.t('ui.changes pending of publish')}
                  </Typography>

                  {app.patchStats.map((localeStats) => (
                    <Box key={localeStats.locale} sx={{ mb: 2 }}>
                      <Chip
                        label={`${localeStats.locale} (${localeStats.count} changes)`}
                        color="success"
                        sx={{ mb: 1 }}
                      />
                      <List dense>
                        {localeStats.items.map((stat, idx) => (
                          <ListItem key={idx} disableGutters>
                            <ListItemText
                              primary={i18n.t('ui.changed songs by author', {
                                ...stat,
                              })}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}
                </>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAboutVisible(false)}>
            {i18n.t('ui.close')}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', gap: 1 }}>
        {app.user ? (
          <>
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={confirmLogout}
              size="small">
              {i18n.t('ui.logout')}
            </Button>
            <Button
              variant="outlined"
              startIcon={<AccountIcon />}
              onClick={() => navigate('/account')}
              size="small">
              {i18n.t('ui.account')}
            </Button>
          </>
        ) : null}
        {!app.user && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            size="small">
            {i18n.t('ui.login')}
          </Button>
        )}
        <Button
          variant="outlined"
          startIcon={<InfoIcon />}
          onClick={() => setAboutVisible(true)}
          size="small">
          {i18n.t('settings_title.about')}
        </Button>
      </Box>
    </>
  );
};

export default AppActions;
