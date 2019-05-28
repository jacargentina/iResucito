// @flow
import React, { Fragment, useContext } from 'react';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import { DataContext } from './DataContext';
import { EditContext } from './EditContext';
import I18n from '../../translations';
import { getValidatedLocale } from '../../common';

const LocalePicker = () => {
  const data = useContext(DataContext);
  const { availableLocales, locale, setLocale } = data;

  const edit = useContext(EditContext);
  const { editSong } = edit;
  const current = getValidatedLocale(availableLocales, locale);

  if (editSong) {
    return null;
  }

  return (
    <Fragment>
      <Dropdown
        item
        pointing
        style={{ marginLeft: 10 }}
        text={I18n.t('settings_title.locale', { locale })}>
        <Dropdown.Menu>
          {availableLocales.map(item => {
            return (
              <Dropdown.Item
                onClick={() => setLocale(item.value)}
                key={item.value}
                active={current && current.value == item.value}
                size="small">
                {item.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      {current && <Menu.Item>{current.label}</Menu.Item>}
    </Fragment>
  );
};

export default LocalePicker;
