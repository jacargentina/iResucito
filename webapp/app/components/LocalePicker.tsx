import { Menu, Dropdown } from 'semantic-ui-react';
import I18n from '~/translations';
import { getLocalesForPicker, getValidatedLocale } from '~/common';
import { useEffect, useState } from 'react';
import { useFetcher, useMatches } from 'remix';

const LocalePicker = () => {
  const matches = useMatches();
  const fetcher = useFetcher();
  const [availableLocales, setAvailableLocales] = useState<PickerLocale[]>([]);
  const [current, setCurrent] = useState<PickerLocale>();

  const locale = matches.find((m) => m.id === 'root')?.data.locale || 'default';

  useEffect(() => {
    const items = getLocalesForPicker(navigator.language);
    const actual = getValidatedLocale(items, locale);
    setAvailableLocales(items);
    setCurrent(actual);
  }, [locale]);

  return (
    <>
      <Dropdown
        item
        pointing
        style={{ marginLeft: 10 }}
        text={I18n.t('settings_title.locale', { locale })}>
        <Dropdown.Menu>
          {availableLocales.map((item) => {
            return (
              <Dropdown.Item
                onClick={() => {
                  const changeTo =
                    item.value === 'default' ? navigator.language : item.value;
                  fetcher.submit(null, {
                    action: '/lang/' + changeTo,
                    method: 'post',
                  });
                }}
                key={item.value}
                active={locale === item.value}
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
