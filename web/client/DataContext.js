// @flow
import React, { useState, useEffect } from 'react';
import I18n from '../../src/translations';
import api from './api';
import { getSongFileFromString } from '../../src/SongsProcessor';

export const DataContext: any = React.createContext();

const DataContextWrapper = (props: any) => {
  const [locale, setLocale] = useState('default');
  const [user, setUser] = useState();
  const [songs, setSongs] = useState();
  const [editSong, setEditSong] = useState();
  const [patchLogs, setPatchLogs] = useState();
  const [text, setText] = useState('');
  const [rename, setRename] = useState();
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState();
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmData, setConfirmData] = useState();
  const [activeDialog, setActiveDialog] = useState();
  const [songFile, setSongFile] = useState();

  const handleApiError = err => {
    setApiLoading(false);
    if (err.response) {
      setApiResult(err.response.data);
    } else {
      setApiResult({ error: err.message });
    }
  };

  const signUp = (email, password) => {
    setApiResult();
    setApiLoading(true);
    return api
      .post('/api/signup', {
        email,
        password
      })
      .then(response => {
        setApiResult(response.data);
        setApiLoading(false);
      })
      .catch(err => {
        handleApiError(err);
      });
  };

  const login = (email, password) => {
    setApiResult();
    setApiLoading(true);
    return api
      .post('/api/login', {
        email,
        password
      })
      .then(response => {
        setApiLoading(false);
        setUser(email);
        api.defaults.headers.Authorization = `Bearer ${response.data.jwt}`;
      })
      .catch(err => {
        handleApiError(err);
      });
  };

  const logout = () => {
    setUser();
    closeEditor();
    delete api.defaults.headers.Authorization;
  };

  const closeEditor = () => {
    setEditSong();
    setText('');
    setRename();
  };

  const listSongs = () => {
    setSongs();
    setApiResult();
    setApiLoading(true);
    return api
      .get(`/api/list/${locale}`)
      .then(result => {
        setApiLoading(false);
        setSongs(result.data);
      })
      .catch(err => {
        handleApiError(err);
      });
  };

  const loadSong = song => {
    setEditSong();
    setApiResult();
    setApiLoading(true);
    return api
      .get(`/api/song/${song.key}/${locale}`)
      .then(result => {
        setApiLoading(false);
        setEditSong(result.data);
        setHasChanges(false);
      })
      .catch(err => {
        handleApiError(err);
      });
  };

  const addSong = () => {
    setApiResult();
    setApiLoading(true);
    return api
      .get('/api/song/newKey')
      .then(result => {
        setApiLoading(false);
        const newSong = {
          key: result.data.key,
          nombre: 'New song',
          titulo: 'New song',
          lines: ['Song text here.']
        };
        setEditSong(newSong);
        setHasChanges(false);
      })
      .catch(err => {
        handleApiError(err);
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
          setApiLoading(true);
          return api
            .delete(`/api/song/${editSong.key}/${locale}`)
            .then(() => {
              setApiLoading(false);
              return loadSong(editSong);
            })
            .catch(err => {
              handleApiError(err);
            });
        }
      }
    });
  };

  const applyChanges = () => {
    if (editSong) {
      var patch = { lines: text, rename: rename || editSong.nombre };
      setApiResult();
      setApiLoading(true);
      return api
        .post(`/api/song/${editSong.key}/${locale}`, patch)
        .then(() => {
          setApiLoading(false);
          setHasChanges(false);
          return loadSong(editSong);
        })
        .catch(err => {
          handleApiError(err);
        });
    }
  };

  useEffect(() => {
    if (editSong && activeDialog === 'patchLog') {
      setPatchLogs();
      setApiResult();
      setApiLoading(true);
      api
        .get(`/api/patches/${editSong.key}/${locale}`)
        .then(result => {
          setApiLoading(false);
          setPatchLogs(result.data);
        })
        .catch(err => {
          handleApiError(err);
        });
    }
  }, [editSong, activeDialog]);

  useEffect(() => {
    I18n.locale = locale == 'default' ? navigator.language : locale;
    console.log('Current locale is', I18n.locale);
  }, [locale]);

  useEffect(() => {
    if (rename) {
      const parsed = getSongFileFromString(rename);
      setSongFile(parsed);
    } else {
      setSongFile(editSong);
    }
  }, [rename, editSong]);

  return (
    <DataContext.Provider
      value={{
        locale,
        setLocale,
        editSong,
        patchLogs,
        songFile,
        loadSong,
        setEditSong,
        confirmData,
        setConfirmData,
        confirmClose,
        hasChanges,
        setHasChanges,
        applyChanges,
        confirmRemovePatch,
        text,
        setText,
        rename,
        setRename,
        activeDialog,
        setActiveDialog,
        apiLoading,
        apiResult,
        songs,
        listSongs,
        addSong,
        signUp,
        login,
        user,
        confirmLogout
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
