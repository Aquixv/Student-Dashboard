import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  ApolloClient, 
  InMemoryCache,
  createHttpLink 
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const httpLink = createHttpLink({
  uri: 'http://localhost:1500/graphql',
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

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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