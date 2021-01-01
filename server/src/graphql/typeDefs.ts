/*
create schema using apollo server inbuilt graphql syntax instead js graphql library

*/
import { gql } from 'apollo-server-express';

// gql : function that takes template literal string and return graphql tree
export const typeDefs = gql`
  type Listing {
    id: ID!
    title: String!
    image: String!
    address: String!
    price: Int!
    numOfGuests: Int!
    numOfBeds: Int!
    numOfBaths: Int!
    rating: Int!
  }

  type Query {
    listings: [Listing!]!
  }
  type Mutation {
    deleteListing(id: ID!): Listing!
  }
`;
