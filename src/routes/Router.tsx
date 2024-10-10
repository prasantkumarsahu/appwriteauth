import React, {useContext, useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import {AppwriteContext} from '../appwrite/AppwriteContext';
import Loading from '../components/Loading';

// Routes
import {AppStack} from './AppStack';
import {AuthStack} from './AuthStack';

export const Router = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {appwrite, isLoggedIn, setIsLoggedIn} = useContext(AppwriteContext);

  useEffect(() => {
    appwrite
      .getCurrentUser()
      .then(response => {
        setIsLoading(false);
        if (response) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch(_ => {
        setIsLoading(false);
        setIsLoggedIn(false);
        console.log('Failed to fetch current user');
      });
  }, [appwrite, setIsLoggedIn]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
