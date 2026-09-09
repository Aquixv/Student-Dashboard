import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_ME } from './graphql/queries';
import type { GetMeResponse } from './types';

// 1. Fixed ProtectedRoute
export default function ProtectedRoute() {
  const token = localStorage.getItem('portal_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // This was missing! It tells React Router to continue rendering the page.
  return <Outlet />;
}

export function AdminRoute() {
  const token = localStorage.getItem('portal_token');
  
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }
  const { data, loading, error } = useQuery<GetMeResponse>(GET_ME);

  if (loading) return <div style={{ padding: '2rem' }}>Verifying Admin Clearances...</div>;

  if (error || !data?.me || data.me.role !== 'Admin') {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
}