import dotenv from 'dotenv';
dotenv.config();
import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql';
import { connectDatabase } from './database/index';
import cookieParser from 'cookie-parser';
const port = process.env.PORT;

const mount = async (app: Application) => {
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));
  app.use(express.json({ limit: '2mb' })); // limit body data
  app.use(cookieParser(process.env.SECRET));
  // resolve functions will interact with the db variable
  const db = await connectDatabase();
  /* 
  1- apollo server instant
   typeDefs: String that represents the entire GraphQL schema.
  resolvers: Map of functions that implement the schema.
  context : an object shared by all resolvers. apolloserver contructor gets called with every request
  */
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  // apolloserver midllerware to work with express middleware and path / endpoint for graphql api url
  server.applyMiddleware({ app, path: '/api' });
  app.listen(port, () => {
    console.log('DB Connected @ localhost:' + port);
  });
};

mount(express());
