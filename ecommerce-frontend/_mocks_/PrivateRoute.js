// src/components/__mocks__/PrivateRoute.js
import React from 'react';
import { Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  return <Outlet />;
};

export default PrivateRoute;