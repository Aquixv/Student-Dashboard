import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ApolloClient, 
  InMemoryCache,
  createHttpLink,
  from // <-- Import 'from' to chain links together
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error'; // <-- Import the error interceptor
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const checkTokenExpiration = () => {
  const token = localStorage.getItem('portal_token');
  if (!token) return;

  try {
    // A JWT has 3 parts separated by dots. The middle part is the data payload.
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // JWT 'exp' is in seconds, Date.now() is in milliseconds
    const isExpired = payload.exp * 1000 < Date.now(); 

    if (isExpired) {
      localStorage.removeItem('portal_token');
      // Redirect to login if they aren't already there
      if (window.location.pathname !== '/') {
        window.location.href = '/'; 
      }
    }
  } catch (error) {
    // If the token is corrupted or manually tampered with, kill it
    localStorage.removeItem('portal_token');
  }
};

// Run the check immediately on initial load
checkTokenExpiration();

const httpLink = createHttpLink({
  uri: import.meta.env.DEV 
    ? 'http://localhost:1500/graphql' 
    : 'https://dashboard-backend-bd8e.onrender.com/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('portal_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// --- THE BOUNCER ---
const errorLink = onError((error: any) => {
  const { graphQLErrors, networkError } = error;
  
  if (graphQLErrors) {
    graphQLErrors.forEach((err: any) => {
      // Safely chain into the error object without TS complaining
      if (
        err?.extensions?.code === 'UNAUTHENTICATED' || 
        err?.message?.toLowerCase().includes('jwt expired') ||
        err?.message?.toLowerCase().includes('not authenticated')
      ) {
        localStorage.removeItem('portal_token');
        window.location.href = '/'; 
      }
    });
  }

  if (networkError && networkError?.statusCode === 401) {
    localStorage.removeItem('portal_token');
    window.location.href = '/';
  }
});

const client = new ApolloClient({
  // Use 'from' to chain the error interceptor BEFORE the auth and http links
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);