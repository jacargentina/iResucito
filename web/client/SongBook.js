// @flow
import React, { Fragment, useContext } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import SongViewPdf from './SongViewPdf';
import { DataContext } from './DataContext';
import I18n from '../../translations';

const SongBook = () => {
  const data = useContext(DataContext);
  const { pdf, setPdf } = data;

  const close = () => {
    setPdf();
  };

  if (!pdf) {
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
      <div style={{ margin: '0 auto' }}>
        <SongViewPdf url={pdf} />
      </div>
    </Fragment>
  );
};

export default SongBook;
