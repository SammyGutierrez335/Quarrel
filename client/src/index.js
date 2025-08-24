import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { HashRouter } from 'react-router-dom';
import App from './components/App';

const httpLink = new HttpLink({ uri: '/graphql' });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('auth-token');
  return {
    headers: {
      ...headers,
      authorization: token ? token : ''
    }
  };
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache
});

// Polyfill writeData for legacy helpers
client.writeData = ({ data }) => {
  try {
    cache.writeQuery({
      query: gql`
        query LocalState {
          isLoggedIn @client
          currentUserId @client
          currentUserEmail @client
        }
      `,
      data
    });
  } catch (e) {
    // If the shape doesn't fully match, write partials
    Object.keys(data || {}).forEach((key) => {
      try {
        cache.writeQuery({
          query: gql`query ${key} { ${key} @client }`,
          data: { [key]: data[key] }
        });
      } catch {}
    });
  }
};

// Initialize local state
client.writeData({
  data: {
    isLoggedIn: !!localStorage.getItem('auth-token'),
    currentUserId: localStorage.getItem('currentUserId') || null,
    currentUserEmail: localStorage.getItem('currentUserEmail') || null
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <HashRouter>
      <App />
    </HashRouter>
  </ApolloProvider>,
  document.getElementById('root')
);
