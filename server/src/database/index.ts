import { MongoClient } from 'mongodb';
import { Database } from '../lib/types';
// Connection URL
const DB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net`;
/*
connectDatabase is a async func so we have to use Promise<Database> to implement types
*/
export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db('airhousedb');
  return {
    listings: db.collection('test_listings'),
  };
};
