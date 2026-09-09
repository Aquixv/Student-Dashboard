import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_ME } from './graphql/queries';
import type { GetMeResponse } from './types';

export default function AdminRoute() {
  const { data, loading } = useQuery<GetMeResponse>(GET_ME);

  if (loading) return <div style={{ padding: '2rem' }}>Authenticating access...</div>;

  if (!data?.me || data.me.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />; // Renders the AdminDashboard if the check passes
}