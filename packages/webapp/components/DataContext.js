// @flow
import React, { useState } from 'react';
import * as axios from 'axios';

export const DataContext: any = React.createContext();

const DataContextWrapper = (props: any) => {
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState();
  const [confirmData, setConfirmData] = useState();
  const [activeDialog, setActiveDialog] = useState();
  const [dialogCallback, setDialogCallback] = useState();

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
    return axios
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

  return (
    <DataContext.Provider
      value={{
        confirmData,
        setConfirmData,
        activeDialog,
        setActiveDialog,
        dialogCallback,
        setDialogCallback,
        apiLoading,
        setApiLoading,
        apiResult,
        setApiResult,
        handleApiError,
        signUp,
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
