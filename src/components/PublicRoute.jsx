// /frontend/src/components/PublicRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// Componente de ruta pública
const PublicRoute = ({ element: Component, ...rest }) => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Route
      {...rest}
      element={!isAuthenticated ? <Component /> : <Navigate to="/dashboard" />}
    />
  );
};

export default PublicRoute;
