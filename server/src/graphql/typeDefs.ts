/*
create schema using apollo server inbuilt graphql syntax instead js graphql library

*/
import { gql } from 'apollo-server-express';

// gql : function that takes template literal string and return graphql tree
export const typeDefs = gql`
  type Query {
    authUrl: String!
  }
  type Mutation {
    logIn: String!
    logOut: String!
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
