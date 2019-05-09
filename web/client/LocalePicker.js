// @flow
import React, { useContext } from 'react';
import { Label } from 'semantic-ui-react';
import { getLocalesForPicker } from '../../src/common';
import { DataContext } from './DataContext';

const LocalePicker = (props: any) => {
  const { enabled } = props;
  const data = useContext(DataContext);
  const { locale, setLocale } = data;
  const locales = getLocalesForPicker(navigator.language);

  return (
    <span style={{ paddingLeft: 10 }}>
      {locales.map(item => {
        return (
          <Label
            as={enabled ? 'a' : null}
            onClick={() => (enabled ? setLocale(item.value) : null)}
            key={item.value}
            color={locale == item.value ? 'red' : null}
            size="small">
            {item.label}
          </Label>
        );
      })}
    </span>
  );
};

export default LocalePicker;
