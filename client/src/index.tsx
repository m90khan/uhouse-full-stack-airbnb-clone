import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
// import { ApolloProvider } from 'react-apollo';
import { ApolloProvider } from '@apollo/react-hooks';

// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/index.css';

/*
1-instantiate the ApolloClient constructor with api url
2- the request function will send the csrf token on every request
*/

const client = new ApolloClient({
  uri: '/api',

  request: async (operation) => {
    const token = sessionStorage.getItem('token');
    operation.setContext({
      headers: {
        'X-CSRF-TOKEN': token || '',
      },
    });
  },
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
Apollo boost : configuration package to setup apollo client
react-apollo : view layer for react to interact with graphQl api
ApolloProvider: provide apollo client contxt everywhere in <APP />
Apollo CLI : to generate typing from the graphql schema
*/
