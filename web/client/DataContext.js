// @flow
import React, { useState } from 'react';
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
  const [pdf, setPdf] = useState({ loading: false, url: null });
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState();
  const [confirmData, setConfirmData] = useState();
  const [activeDialog, setActiveDialog] = useState();

  const handleApiError = err => {
    setApiLoading(false);
    if (err.response && err.response.data) {
      setApiResult(err.response.data);
    } else if (err.request) {
      setApiResult({ error: err.request });
    } else if (err.message) {
      setApiResult({ error: err.message });
    } else if (err.error) {
      setApiResult({ error: err.error });
    } else {
      setApiResult({ error: err });
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
    setApiResult();
    setApiLoading(true);
    return api
      .get(`/api/list/${I18n.locale}`)
      .then(result => {
        setApiLoading(false);
        setSongs(result.data);
      })
      .catch(err => {
        handleApiError(err);
      });
  };

  const previewPdf = () => {
    const savedSettings = localStorage.getItem('pdfExportOptions');
    var data;
    if (savedSettings) {
      data = {
        options: JSON.parse(savedSettings)
      };
    }
    setPdf({ loading: true, url: null });
    return api
      .post(`/api/pdf/${I18n.locale}`, data, {
        responseType: 'blob'
      })
      .then(response => {
        setPdf({
          loading: false,
          url: window.URL.createObjectURL(new Blob([response.data]))
        });
      })
      .catch(async err => {
        var text = await new Response(err.response.data).text();
        handleApiError(JSON.stringify(text));
        setPdf({ loading: false, url: null });
      });
  };

  const changeLocale = (candidate: string) => {
    // Establecer el valor....
    applyLocale(candidate);
    // Tomar el resultado
    setLocale(I18n.locale);
  };

  return (
    <DataContext.Provider
      value={{
        stats,
        availableLocales,
        locale,
        changeLocale,
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
        signUp,
        login,
        logout,
        user,
        previewPdf,
        pdf,
        setPdf
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
