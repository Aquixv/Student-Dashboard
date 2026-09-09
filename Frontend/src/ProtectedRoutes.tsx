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

// 2. Fixed AdminRoute
export function AdminRoute() {
  // Added the error object to the destructuring
  const { data, loading, error } = useQuery<GetMeResponse>(GET_ME);

  if (loading) return <div style={{ padding: '2rem' }}>Authenticating access...</div>;

  // If there's a GraphQL error, OR no user data, OR they aren't an admin, kick them out
  if (error || !data?.me || data.me.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  // If they pass all checks, let them in
  return <Outlet />;
}