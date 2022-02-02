import React, { useState } from 'react';

export const DataContext = React.createContext<any>(null);

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
      }}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContextWrapper;
