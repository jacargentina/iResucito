// @flow
import React, { Fragment, useContext } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Loader from 'semantic-ui-react/dist/commonjs/elements/Loader';
import SongViewPdf from './SongViewPdf';
import { DataContext } from './DataContext';
import I18n from '../../translations';

const SongBook = () => {
  const data = useContext(DataContext);
  const { pdf, setPdf } = data;

  const close = () => {
    setPdf({ loading: false, url: null });
  };

  if (pdf.loading === false && pdf.url === null) {
    return null;
  }

  return (
    <Fragment>
      <Menu size="mini" inverted attached color="blue">
        <Menu.Item position="right">
          <Button onClick={close}>
            <Icon name="close" />
            {I18n.t('ui.close')}
          </Button>
        </Menu.Item>
      </Menu>
      {pdf.loading && (
        <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Loader active inline="centered" size="large" inverted={false} />
        </div>
      )}
      {!pdf.loading && (
        <div style={{ margin: '0 auto', padding: 20, overflow: 'scroll' }}>
          <SongViewPdf url={pdf.url} />
        </div>
      )}
    </Fragment>
  );
};

export default SongBook;
