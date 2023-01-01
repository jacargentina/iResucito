import { useActionData } from '@remix-run/react';
import { Message } from 'semantic-ui-react';
import i18n from '@iresucito/translations';

const ApiMessage = () => {
  const data = useActionData();

  if (!data?.error && !data?.ok) {
    return null;
  }

  return (
    <Message negative={data?.error} positive={data?.ok}>
      <Message.Header>
        {data?.error && i18n.t('ui.error ocurred')}
        {data?.ok && i18n.t('ui.info message')}
      </Message.Header>
      <p>
        {data?.error} {data?.ok}
      </p>
    </Message>
  );
};

export default ApiMessage;
