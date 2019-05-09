// @flow
import React, { useState, useEffect } from 'react';
import I18n from '../../src/translations';

export const DataContext: any = React.createContext();

const DataContextWrapper = (props: any) => {
  const [locale, setLocale] = useState(navigator.language);
  const [editSong, setEditSong] = useState();
  const [confirmData, setConfirmData] = useState();

  useEffect(() => {
    I18n.locale = locale;
    console.log('Current locale is', I18n.locale);
  }, [locale]);

  return (
    <DataContext.Provider
      value={{
        locale,
        setLocale,
        editSong,
        setEditSong,
        confirmData,
        setConfirmData
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
