// @flow
import React, { Fragment, useContext } from 'react';
import { Dropdown, Menu } from 'semantic-ui-react';
import { getLocalesForPicker } from '../../src/common';
import I18n from '../../src/translations';
import { DataContext } from './DataContext';

const LocalePicker = () => {
  const data = useContext(DataContext);
  const { locale, setLocale } = data;
  const locales = getLocalesForPicker(navigator.language);
  const loc = locale.split('-')[0];
  const current = locales.find(l => l.value === locale || l.value === loc);

  return (
    <Fragment>
      <Dropdown
        item
        pointing
        style={{ marginLeft: 10 }}
        text={I18n.t('settings_title.locale', { locale })}>
        <Dropdown.Menu>
          {locales.map(item => {
            return (
              <Dropdown.Item
                onClick={() => setLocale(item.value)}
                key={item.value}
                color={locale == item.value ? 'red' : null}
                size="small">
                {item.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      <Menu.Item>{current.label}</Menu.Item>
    </Fragment>
  );
};

export default LocalePicker;
