import { createContext, useEffect, useState } from 'react';

import PropType from 'prop-types';

import { useGetUserQuery } from './authApi';
import { getCookieValue } from '../route/RequireAuth';
export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [userAuth, setUserAuth] = useState(null);

  const { data } = useGetUserQuery(undefined, {
    skip:
      !getCookieValue('accessToken').length ||
      (userAuth && getCookieValue('accessToken')),
  });

  useEffect(() => {
    data && setUserAuth(data.data);
  }, [data, setUserAuth]);

  const addUser = (response) => {
    document.cookie = 'accessToken=' + response.accessToken;
    document.cookie = 'id=' + response._id;
    setUserAuth(response);
  };

  const removeUser = () => {
    document.cookie =
      'accessToken=;path="";expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'id=;path="";expires=Thu, 01 Jan 1970 00:00:01 GMT';
  };
  return (
    <AuthContext.Provider
      value={{ userAuth, setUserAuth, addUser, removeUser }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
AuthContextProvider.propTypes = {
  children: PropType.any,
};
