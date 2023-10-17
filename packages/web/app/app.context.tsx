import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useFetcher } from '@remix-run/react';
import i18n from '@iresucito/translations';
import { PatchStats, PickerLocale } from '@iresucito/core';

type AppContextData = {
  user?: any;
  ios_version: string;
  android_version: string;
  patchStats: Array<PatchStats>;
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
  changeLanguage: Function;
  locale: string;
  isChangingLanguage: boolean;
};

const AppContext = createContext<AppContextData | undefined>(undefined);

export const AppProvider = (props: {
  children: any;
  user?: any;
  ios_version: string;
  android_version: string;
  patchStats: any;
  locale: string;
}) => {
  const { children, user, ios_version, android_version, patchStats, locale } =
    props;
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState();
  const [confirmData, setConfirmData] = useState();
  const [activeDialog, setActiveDialog] = useState();
  const [dialogCallback, setDialogCallback] = useState();
  const fetcher = useFetcher<{ newLocale: string }>();

  const changeLanguage = useCallback((item: PickerLocale) => {
    const changeTo = item.value === 'default' ? navigator.language : item.value;
    fetcher.submit(null, {
      action: '/lang/' + changeTo,
      method: 'post',
    });
  }, []);

  useEffect(() => {
    if (fetcher.data?.newLocale) {
      i18n.locale = fetcher.data?.newLocale;
    }
  }, [fetcher.data]);

  const handleApiError = (err: any) => {
    setApiLoading(false);
    if (err.response && err.response.data) {
      setApiResult(err.response.data);
    } else if (err.request) {
      setApiResult(err.request);
    } else if (err.message) {
      setApiResult(err.message);
    } else if (err.error) {
      setApiResult(err.error);
    } else {
      setApiResult(err);
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
        changeLanguage,
        locale,
        isChangingLanguage: fetcher.state !== 'idle',
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
