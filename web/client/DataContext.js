// @flow
import React, { useState, useEffect } from 'react';
import I18n from '../../src/translations';
import api from './api';

export const DataContext: any = React.createContext();

I18n.locale = navigator.language;

const DataContextWrapper = (props: any) => {
  const [locale, setLocale] = useState(I18n.locale);
  const [user, setUser] = useState();
  const [songs, setSongs] = useState();
  const [editSong, setEditSong] = useState();
  const [text, setText] = useState();
  const [apiResult, setApiResult] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmData, setConfirmData] = useState();

  const signUp = (email, password) => {
    setApiResult();
    return api
      .post('/api/signup', {
        email,
        password
      })
      .then(response => {
        setApiResult(response.data);
      })
      .catch(err => {
        setApiResult(err.response.data);
      });
  };

  const login = (email, password) => {
    setApiResult();
    return api
      .post('/api/login', {
        email,
        password
      })
      .then(response => {
        setUser(email);
        api.defaults.headers.Authorization = `Bearer ${response.data.jwt}`;
      })
      .catch(err => {
        setApiResult(err.response.data);
      });
  };

  const logout = () => {
    setUser();
    closeEditor();
    delete api.defaults.headers.Authorization;
  };

  const closeEditor = () => {
    setEditSong();
    setText();
  };

  const listSongs = () => {
    setApiResult();
    return api
      .get(`/api/list/${locale}`)
      .then(result => {
        setSongs(result.data);
      })
      .catch(err => {
        setApiResult(err.response.data);
      });
  };

  const loadSong = song => {
    setApiResult();
    return api
      .get(`/api/song/${song.key}/${locale}`)
      .then(result => {
        setEditSong(result.data);
        setHasChanges(false);
      })
      .catch(err => {
        setApiResult(err.response.data);
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

  const confirmLogout = () => {
    if (hasChanges) {
      setConfirmData({
        message: I18n.t('ui.discard confirmation'),
        yes: () => {
          logout();
        }
      });
    } else {
      logout();
    }
  };

  const confirmRemovePatch = () => {
    setConfirmData({
      message: I18n.t('ui.discard confirmation'),
      yes: () => {
        if (editSong) {
          setApiResult();
          return api
            .delete(`/api/song/${editSong.key}/${locale}`)
            .then(() => {
              return loadSong(editSong);
            })
            .catch(err => {
              setApiResult(err.response.data);
              console.log({ err });
            });
        }
      }
    });
  };

  const applyChanges = () => {
    if (editSong) {
      setApiResult();
      return api
        .post(`/api/song/${editSong.key}/${locale}`, { lines: text })
        .then(() => {
          setHasChanges(false);
          return loadSong(editSong);
        })
        .catch(err => {
          setApiResult(err.response.data);
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
        confirmRemovePatch,
        text,
        setText,
        setConfirmData,
        apiResult,
        songs,
        listSongs,
        signUp,
        apiResult,
        login,
        user,
        confirmLogout
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
