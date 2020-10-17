// @flow
import React, { useState } from 'react';
import I18n from '../../../translations';
import api from './api';

export const DataContext: any = React.createContext();

const DataContextWrapper = (props: any) => {
  const [editSong, setEditSong] = useState();
  const [pdf, setPdf] = useState({ loading: false, url: null });
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState();
  const [confirmData, setConfirmData] = useState();
  const [activeDialog, setActiveDialog] = useState();

  const handleApiError = (err) => {
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
        password,
      })
      .then((response) => {
        setApiResult(response.data);
        setApiLoading(false);
      })
      .catch((err) => {
        handleApiError(err);
      });
  };

  const previewPdf = () => {
    const savedSettings = localStorage.getItem('pdfExportOptions');
    const data = {
      options: null,
    };
    if (savedSettings) {
      data.options = JSON.parse(savedSettings);
    }
    setPdf({ loading: true, url: null });
    return api
      .post(`/api/pdf/${I18n.locale}`, data, {
        responseType: 'blob',
      })
      .then((response) => {
        setPdf({
          loading: false,
          url: window.URL.createObjectURL(new Blob([response.data])),
        });
      })
      .catch(async (err) => {
        var text = await new Response(err.response.data).text();
        handleApiError(JSON.stringify(text));
        setPdf({ loading: false, url: null });
      });
  };

  return (
    <DataContext.Provider
      value={{
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
        signUp,
        previewPdf,
        pdf,
        setPdf,
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
