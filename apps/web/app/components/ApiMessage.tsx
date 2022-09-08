import { useActionData } from 'remix';
import { Message } from 'semantic-ui-react';
import I18n from '~/translations';

const ApiMessage = () => {
  const data = useActionData();

  if (!data?.error && !data?.ok) {
    return null;
  }

  return (
    <Message negative={data?.error} positive={data?.ok}>
      <Message.Header>
        {data?.error && I18n.t('ui.error ocurred')}
        {data?.ok && I18n.t('ui.info message')}
      </Message.Header>
      <p>
        {data?.error} {data?.ok}
      </p>
    </Message>
  );
};

export default ApiMessage;
