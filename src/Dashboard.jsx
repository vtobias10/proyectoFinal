import React from 'react';
import { Navigate } from 'react-router-dom';

const Dashboard = ({ isAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.replace('/');
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className='text-center'>
      <h1>Dashboard</h1>
      <button onClick={handleLogout} className='btn btn-danger'>Cerrar Sesión</button>
    </div>
  );
};

export default Dashboard;
