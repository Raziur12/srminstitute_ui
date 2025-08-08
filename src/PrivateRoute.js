import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access'); // Check token
    setIsAuthenticated(!!token); // Convert to boolean
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Prevents flashing effect
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
