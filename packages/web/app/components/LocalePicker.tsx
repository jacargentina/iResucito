import { useMemo } from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import i18n from '@iresucito/translations';
import { useApp } from '~/app.context';
import {
  getLocalesForPicker,
  getValidatedLocale,
  PickerLocale,
} from '@iresucito/core';

const LocalePicker = () => {
  const app = useApp();
  const { patchStats } = app;

  const availableLocales = useMemo<PickerLocale[]>(() => {
    return getLocalesForPicker(app.locale);
  }, []);

  const current = useMemo<PickerLocale | undefined>(() => {
    return getValidatedLocale(availableLocales, app.locale);
  }, [app.locale]);

  return (
    <>
      <Dropdown
        item
        pointing
        style={{ marginLeft: 10 }}
        text={`${i18n.t('settings_title.locale', { locale: app.locale })} (${
          app.locale
        })`}>
        <Dropdown.Menu>
          {availableLocales.map((item) => {
            const stat = patchStats.find((st) => st.locale == item.value);
            return (
              <Dropdown.Item
                onClick={() => {
                  app.changeLanguage(item);
                }}
                key={item.value}
                active={app.locale === item.value}
                size="small">
                {item.label} - {item.value} {stat ? `(${stat?.count})` : null}
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
