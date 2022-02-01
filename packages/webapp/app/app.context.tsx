import { createContext, useContext } from 'react';

type AppContextData = {
  user?: any;
};

const AppContext = createContext<AppContextData | undefined>(undefined);

export const AppProvider = (props: { children: any; user?: any }) => {
  const { children, user } = props;

  return (
    <AppContext.Provider
      value={{
        user,
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
