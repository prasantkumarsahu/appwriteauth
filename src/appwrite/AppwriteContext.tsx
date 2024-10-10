import {createContext, FC, PropsWithChildren, useEffect, useState} from 'react';
import Appwrite from './service'; // Import your Appwrite service

type AppContextType = {
  appwrite: Appwrite;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

export const AppwriteContext = createContext<AppContextType>({
  appwrite: new Appwrite(),
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

const appwriteInstance = new Appwrite(); // Singleton Appwrite instance

export const AppwriteProvider: FC<PropsWithChildren> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const defaultValue = {
    appwrite: appwriteInstance, // Pass singleton instance here
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <AppwriteContext.Provider value={defaultValue}>
      {children}
    </AppwriteContext.Provider>
  );
};
