import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';
import { connectDatabase } from './database/index';
const port = process.env.PORT;

const mount = async (app: Application) => {
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(express.json({ limit: '10kb' })); // limit body data
  // resolve functions will interact with the db variable
  const db = await connectDatabase();
  /* 
  1- apollo server instant
  const server = new ApolloServer({typeDefs: `` , resolvers: {}});
  
  typeDefs: String that represents the entire GraphQL schema.
  resolvers: Map of functions that implement the schema.

  context : an object shared by all resolvers. apolloserver contructor gets called with every request
  */
  const server = new ApolloServer({ typeDefs, resolvers, context: () => ({ db }) });
  // apolloserver midllerware to work with express middleware and path for graphql api
  server.applyMiddleware({ app, path: '/api' });
  app.listen(port, () => {
    console.log('DB Connected @ localhost:' + port);
  });
  // const listings = await db.listings.find({}).toArray();
  // console.log(listings);
};

mount(express());
