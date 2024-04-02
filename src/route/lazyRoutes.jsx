import React from 'react';

import PropType from 'prop-types';
import { useRoutes } from 'react-router-dom';

import { LoginRoutes, PrivateRoutes } from './RequireAuth';
import Loader from '../components/Loader';

export const Router = () => {
  const LazyReg = React.lazy(() => import('../pages/register/Register'));
  const LazyLogin = React.lazy(() => import('../pages/login/Login'));
  const LazyHome = React.lazy(() => import('../pages/home/Home'));
  const LazyProfile = React.lazy(() => import('../pages/profile/Profile'));
  const element = useRoutes([
    {
      element: <PrivateRoutes />,
      children: [
        {
          path: '/',
          element: <ReactSuspense Component={LazyHome} />,
        },
        {
          path: '/profile',
          element: <ReactSuspense Component={LazyProfile}></ReactSuspense>,
        },
      ],
    },
    {
      element: <LoginRoutes />,
      children: [
        {
          path: '/register',
          element: <ReactSuspense Component={LazyReg} />,
        },
        {
          path: '/login',
          element: <ReactSuspense Component={LazyLogin}></ReactSuspense>,
        },
      ],
    },
    { path: '*', element: <h1>Page not Found! </h1> },
  ]);
  return element;
};

export const ReactSuspense = ({ Component }) => (
  <React.Suspense fallback={<Loader />}>
    <Component />
  </React.Suspense>
);
ReactSuspense.propTypes = {
  Component: PropType.any,
};
