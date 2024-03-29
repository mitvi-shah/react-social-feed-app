import React from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar';

export const getCookieValue = (name) =>
  document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';

export const PrivateRoutes = () => {
  return getCookieValue('accessToken') ? (
    <>
      <Navbar />
      <div className="layout">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/login" />
  );
};
export const LoginRoutes = () => {
  return getCookieValue('accessToken') ? <Navigate to="/" /> : <Outlet />;
};
