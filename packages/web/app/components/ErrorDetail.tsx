import { Alert, AlertTitle, Box } from '@mui/material';

const ErrorDetail = (props: any) => {
  const message = props.error.message;
  const detail = <pre>{JSON.stringify(props.error, null, 2)}</pre>;

  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      <p>{message}</p>
      {!props.simple && <Box>{detail}</Box>}
    </Alert>
  );
};

export default ErrorDetail;
