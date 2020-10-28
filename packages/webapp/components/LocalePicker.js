// @flow
import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import useLocale from './useLocale';
import I18n from '../../../translations';
import { getValidatedLocale } from '../../../common';

const LocalePicker = () => {
  const locale = useLocale();
  const current = getValidatedLocale(locale.availableLocales, locale.current);
  return (
    <>
      <Dropdown
        item
        pointing
        style={{ marginLeft: 10 }}
        text={I18n.t('settings_title.locale', { locale: locale.current })}>
        <Dropdown.Menu>
          {locale.availableLocales.map((item) => {
            const active =
              current &&
              current.value === item.value &&
              typeof window !== 'undefined';
            return (
              <Dropdown.Item
                onClick={() => locale.changeLocale(item.value, true)}
                key={item.value}
                active={active}
                size="small">
                {item.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      {current && <Menu.Item>{current.label}</Menu.Item>}
    </>
  );
};

export default LocalePicker;
