// @flow
import React, { useState, useEffect } from 'react';
import I18n from '../../translations';
import api from './api';
import { getLocalesForPicker, getValidatedLocale } from '../../common';

export const DataContext: any = React.createContext();

const availableLocales = getLocalesForPicker(navigator.language);

const applyLocale = (candidate: string) => {
  const str = candidate === 'default' ? navigator.language : candidate;
  const validated = getValidatedLocale(availableLocales, str);
  if (validated && I18n.locale !== validated.value) {
    I18n.locale = validated.value;
    console.log('Current locale:', I18n.locale);
  }
  if (!validated) {
    console.log('Current locale: Cannot set with cantidate', candidate);
  }
};

applyLocale(navigator.language);

const DataContextWrapper = (props: any) => {
  const [locale, setLocale] = useState(I18n.locale);
  const [user, setUser] = useState();
  const [stats, setStats] = useState();
  const [songs, setSongs] = useState();
  const [editSong, setEditSong] = useState();
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState();
  const [confirmData, setConfirmData] = useState();
  const [activeDialog, setActiveDialog] = useState();

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
        api.defaults.headers.Authorization = `Bearer ${response.data.jwt}`;
        setApiLoading(false);
        setUser(email);
        setStats(response.data.stats);
      })
      .catch(err => {
        handleApiError(err);
      });
  };

  const logout = () => {
    setUser();
    delete api.defaults.headers.Authorization;
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
          lines: ['Song text here.'],
          stage: 'precatechumenate'
        };
        setEditSong(newSong);
      })
      .catch(err => {
        handleApiError(err);
      });
  };

  useEffect(() => {
    applyLocale(locale);
  }, [locale]);

  return (
    <DataContext.Provider
      value={{
        stats,
        availableLocales,
        locale,
        setLocale,
        editSong,
        setEditSong,
        confirmData,
        setConfirmData,
        activeDialog,
        setActiveDialog,
        apiLoading,
        setApiLoading,
        apiResult,
        setApiResult,
        handleApiError,
        songs,
        listSongs,
        addSong,
        signUp,
        login,
        logout,
        user
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
