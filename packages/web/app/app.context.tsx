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
  expo_version: string;
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
  handleApiError: (path: string, err: any) => void;
  changeLanguage: Function;
  locale: string;
  isChangingLanguage: boolean;
};

const AppContext = createContext<AppContextData | undefined>(undefined);

type ApiResult = {
  path: string;
  error: any;
};

export const AppProvider = (props: {
  children: any;
  user?: any;
  expo_version: string;
  patchStats: any;
  locale: string;
}) => {
  const { children, user, expo_version, patchStats, locale } = props;
  const [apiLoading, setApiLoading] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResult | null>(null);
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

  const handleApiError = (path: string, err: any) => {
    setApiLoading(false);
    if (err.response && err.response.data) {
      setApiResult({ path, error: err.response.data });
    } else if (err.request) {
      setApiResult({ path, error: err.request });
    } else if (err.message) {
      setApiResult({ path, error: err.message });
    } else if (err.error) {
      setApiResult({ path, error: err.error });
    } else {
      setApiResult({ path, error: err });
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        expo_version,
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
