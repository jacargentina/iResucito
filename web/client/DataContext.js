// @flow
import React, { useState, useEffect } from 'react';
import I18n from '../../src/translations';
import api from './api';

export const DataContext: any = React.createContext();

const DataContextWrapper = (props: any) => {
  const [locale, setLocale] = useState(navigator.language);
  const [editSong, setEditSong] = useState();
  const [text, setText] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmData, setConfirmData] = useState();

  const closeEditor = () => {
    setEditSong();
    setText();
  };

  const confirmClose = () => {
    if (hasChanges) {
      setConfirmData({
        message: I18n.t('ui.discard confirmation'),
        yes: () => {
          closeEditor();
        }
      });
    } else {
      closeEditor();
    }
  };

  const removePatch = () => {
    if (editSong) {
      api
        .delete(`/api/song/${editSong.key}/${locale}`)
        .then(result => {
          console.log({ result });
          // TODO recargar
          setHasChanges(false);
        })
        .catch(err => {
          console.log({ err });
        });
    }
  };

  const applyChanges = () => {
    if (editSong) {
      api
        .post(`/api/song/${editSong.key}/${locale}`, { lines: text })
        .then(result => {
          console.log({ result });
          setHasChanges(false);
        })
        .catch(err => {
          console.log({ err });
        });
    }
  };

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
        confirmClose,
        hasChanges,
        setHasChanges,
        applyChanges,
        removePatch,
        text,
        setText,
        setConfirmData
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
