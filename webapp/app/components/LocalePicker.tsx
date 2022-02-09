import { useCallback, useEffect, useMemo } from 'react';
import { useFetcher } from 'remix';
import { Menu, Dropdown } from 'semantic-ui-react';
import I18n from '~/translations';
import { useApp } from '~/app.context';
import { getLocalesForPicker, getValidatedLocale } from '~/common';

let availableLocales: PickerLocale[] = [];

availableLocales = getLocalesForPicker(
  typeof navigator !== 'undefined' ? navigator.language : undefined
);

const LocalePicker = () => {
  const fetcher = useFetcher();
  const app = useApp();

  const current = useMemo<PickerLocale | undefined>(() => {
    return getValidatedLocale(availableLocales, app.locale);
  }, [availableLocales, app.locale]);

  const changeLanguage = useCallback((item: PickerLocale) => {
    const changeTo = item.value === 'default' ? navigator.language : item.value;
    fetcher.submit(null, {
      action: '/lang/' + changeTo,
      method: 'post',
    });
  }, []);

  useEffect(() => {
    if (fetcher.data?.newLocale) {
      I18n.locale = fetcher.data?.newLocale;
    }
  }, [fetcher.data]);

  return (
    <>
      <Dropdown
        item
        pointing
        style={{ marginLeft: 10 }}
        text={I18n.t('settings_title.locale', { locale: app.locale })}>
        <Dropdown.Menu>
          {availableLocales.map((item) => {
            return (
              <Dropdown.Item
                onClick={() => {
                  changeLanguage(item);
                }}
                key={item.value}
                active={app.locale === item.value}
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
