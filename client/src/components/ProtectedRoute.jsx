import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return <Outlet />;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;