import { createContext, useContext } from 'react';

type AppContextData = {
  user?: any;
  ios_version: string;
  android_version: string;
};

const AppContext = createContext<AppContextData | undefined>(undefined);

export const AppProvider = (props: {
  children: any;
  user?: any;
  ios_version: string;
  android_version: string;
}) => {
  const { children, user, ios_version, android_version } = props;

  return (
    <AppContext.Provider
      value={{
        user,
        ios_version,
        android_version,
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
