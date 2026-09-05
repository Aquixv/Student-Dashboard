import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('portal_token');

  // If there is no token, boot them to the login page immediately
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If they have a token, render whatever route they were trying to access
  return <Outlet />;
}