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