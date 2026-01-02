import { useActionData } from '@remix-run/react';
import { Alert, AlertTitle } from '@mui/material';
import i18n from '@iresucito/translations';

const ApiMessage = () => {
  const data = useActionData<{ error: string; ok: boolean }>();

  if (!data?.error && !data?.ok) {
    return null;
  }

  return (
    <Alert severity={data?.error ? 'error' : 'success'} sx={{ mt: 2 }}>
      <AlertTitle>
        {data?.error && i18n.t('ui.error ocurred')}
        {data?.ok && i18n.t('ui.info message')}
      </AlertTitle>
      <p>
        {data?.error} {data?.ok}
      </p>
    </Alert>
  );
};

export default ApiMessage;
