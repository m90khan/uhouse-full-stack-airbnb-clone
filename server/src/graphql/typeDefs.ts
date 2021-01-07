/*
create schema using apollo server inbuilt graphql syntax instead js graphql library

*/
import { gql } from 'apollo-server-express';

// gql : function that takes template literal string and return graphql tree

/*
VIEWER OBJECT
id: ID - a unique identifier since every user in our database is to have a unique id.
token: String - a unique token value to help in countering Cross-Site Request Forgery,
avatar: String - the viewer's avatar image URL.
hasWallet: Boolean - a boolean value to indicate if the viewer has connected to the payment processor in our app (Stripe).
didRequest: Boolean! - a boolean value to indicate if a request has been made from the client to obtain viewer information. */
export const typeDefs = gql`
  # Current user expected object
  type Viewer {
    id: ID
    token: String
    avatar: String
    hasWallet: Boolean
    didRequest: Boolean!
  }

  input LogInInput {
    code: String!
  }

  type Query {
    authUrl: String!
  }

  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`;

/*

QUERY 
1- redirect user to the url to sign in . authUrl 
MUTATION
2 - Once user provide code . user will be redirected to /login and pass the code to server
3- server then make request to google services to retreive the access token
3- logout 
*/
