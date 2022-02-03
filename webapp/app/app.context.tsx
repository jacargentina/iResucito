import { createContext, useContext, useState } from 'react';

type AppContextData = {
  user?: any;
  ios_version: string;
  android_version: string;
  patchStats: any;
  confirmData: any;
  setConfirmData: any;
  activeDialog: any;
  setActiveDialog: any;
  dialogCallback: any;
  setDialogCallback: any;
  apiLoading: any;
  setApiLoading: any;
  apiResult: any;
  setApiResult: any;
  handleApiError: any;
};

const AppContext = createContext<AppContextData | undefined>(undefined);

export const AppProvider = (props: {
  children: any;
  user?: any;
  ios_version: string;
  android_version: string;
  patchStats: any;
}) => {
  const { children, user, ios_version, android_version, patchStats } = props;
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
    <AppContext.Provider
      value={{
        user,
        ios_version,
        android_version,
        patchStats,
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
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp no encuentra un AppProvider contenedor.');
  }
  return context;
};

export default AppContext;
