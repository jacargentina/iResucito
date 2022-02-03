import { Message } from 'semantic-ui-react';
import I18n from '~/translations';
import { useApp } from '~/app.context';

const ApiMessage = () => {
  const app = useApp();
  const { apiResult } = app;
  if (!apiResult) {
    return null;
  }

  return (
    <Message negative={!!apiResult.error} positive={!!apiResult.ok}>
      <Message.Header>
        {apiResult.error && I18n.t('ui.error ocurred')}
        {apiResult.ok && I18n.t('ui.info message')}
      </Message.Header>
      <p>
        {apiResult.error} {apiResult.ok}
      </p>
    </Message>
  );
};

export default ApiMessage;
