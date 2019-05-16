// @flow
import React, { useContext } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { getLocalesForPicker } from '../../src/common';
import I18n from '../../src/translations';
import { DataContext } from './DataContext';

const LocalePicker = () => {
  const data = useContext(DataContext);
  const { locale, setLocale } = data;
  const locales = getLocalesForPicker(navigator.language);

  return (
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
  );
};

export default LocalePicker;
