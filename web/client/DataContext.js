// @flow
import React, { useState, useEffect } from 'react';
import I18n from '../../src/translations';
import api from './api';

export const DataContext: any = React.createContext();

const DataContextWrapper = (props: any) => {
  const [locale, setLocale] = useState(navigator.language);
  const [user, setUser] = useState();
  const [songs, setSongs] = useState();
  const [editSong, setEditSong] = useState();
  const [text, setText] = useState();
  const [apiError, setApiError] = useState();
  const [apiMessage, setApiMessage] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmData, setConfirmData] = useState();

  const signUp = (email, password) => {
    setApiMessage();
    setApiError();
    api
      .post('/api/signup', {
        email,
        password
      })
      .then(response => {
        setApiMessage(response.data);
      })
      .catch(err => {
        setApiError(err.response.data);
      });
  };

  const login = (email, password) => {
    setApiError();
    api
      .post('/api/login', {
        email,
        password
      })
      .then(response => {
        setUser(email);
        api.defaults.headers.Authorization = `Bearer ${response.data.jwt}`;
      })
      .catch(err => {
        setApiError(err.response.data);
      });
  };

  const logout = () => {
    setUser();
    delete api.defaults.headers.Authorization;
  };

  const closeEditor = () => {
    setEditSong();
    setText();
  };

  const listSongs = () => {
    setApiError();
    api
      .get(`/api/list/${locale}`)
      .then(result => {
        setSongs(result.data);
      })
      .catch(err => {
        setApiError(err.response.data);
      });
  };

  const loadSong = song => {
    setApiError();
    api
      .get(`/api/song/${song.key}/${locale}`)
      .then(result => {
        setEditSong(result.data);
      })
      .catch(err => {
        setApiError(err.response.data);
      });
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
      setApiError();
      api
        .delete(`/api/song/${editSong.key}/${locale}`)
        .then(result => {
          console.log({ result });
          // TODO recargar
          setHasChanges(false);
        })
        .catch(err => {
          setApiError(err.response.data);
          console.log({ err });
        });
    }
  };

  const applyChanges = () => {
    if (editSong) {
      setApiError();
      api
        .post(`/api/song/${editSong.key}/${locale}`, { lines: text })
        .then(result => {
          console.log({ result });
          setHasChanges(false);
        })
        .catch(err => {
          setApiError(err.response.data);
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
        loadSong,
        setEditSong,
        confirmData,
        confirmClose,
        hasChanges,
        setHasChanges,
        applyChanges,
        removePatch,
        text,
        setText,
        setConfirmData,
        apiError,
        songs,
        listSongs,
        signUp,
        apiMessage,
        login,
        user,
        logout
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
