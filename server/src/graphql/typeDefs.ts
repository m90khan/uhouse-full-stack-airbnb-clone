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
  enum ListingType {
    APARTMENT
    HOUSE
  }
  type Listing {
    id: ID!
    title: String!
    description: String!
    image: String!
    host: User!
    type: ListingType!
    address: String!
    country: String!
    admin: String!
    city: String!
    bookings(limit: Int!, page: Int!): Bookings
    bookingsIndex: String!
    price: Int!
    numOfGuests: Int!
  }
  type Listings {
    region: String
    total: Int!
    result: [Listing!]!
  }
  type Booking {
    id: ID!
    listing: Listing!
    tenant: User!
    checkIn: String!
    checkOut: String!
  }

  type Bookings {
    total: Int!
    result: [Booking!]!
  }
  # user query type : income and booking options are protected
  # resolve only the user access its bookings
  type User {
    id: ID!
    name: String!
    avatar: String!
    contact: String!
    hasWallet: Boolean!
    income: Int
    bookings(limit: Int!, page: Int!): Bookings
    listings(limit: Int!, page: Int!): Listings!
  }

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
  enum ListingsFilter {
    PRICE_LOW_TO_HIGH
    PRICE_HIGH_TO_LOW
  }
  input ConnectStripeInput {
    code: String!
  }
  input HostListingInput {
    title: String!
    description: String!
    image: String!
    type: ListingType!
    address: String!
    price: Int!
    numOfGuests: Int!
  }
  input CreateBookingInput {
    id: ID!
    source: String!
    checkIn: String!
    checkOut: String!
  }
  type Query {
    authUrl: String!
    user(id: ID!): User!
    listing(id: ID!): Listing!
    listings(
      location: String
      filter: ListingsFilter!
      limit: Int!
      page: Int!
    ): Listings!
  }

  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
    connectStripe(input: ConnectStripeInput!): Viewer!
    disconnectStripe: Viewer!
    hostListing(input: HostListingInput!): Listing!
    createBooking(input: CreateBookingInput!): Booking!
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
