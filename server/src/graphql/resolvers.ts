// import { listings } from '../listings';
import { ObjectId } from 'mongodb';

// Iresolvers  help defined types of resolver map
import { IResolvers } from 'apollo-server-express';
import { Database, Listing } from '../lib/types';
//  resolvers: just a map of object tthat relate with schema field that resolve that field

export const resolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray();
    },
  },
  Mutation: {
    /*
      Apollo server : args types arenot explicitly defined
root:   The object returned from the resolver on the parent ﬁeld. set to undefined 
 we haven't defined it 
      */
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteRes = await db.listings.findOneAndDelete({ _id: new ObjectId(id) });
      if (!deleteRes.value) {
        throw new Error('failed to delete listing');
      }
      return deleteRes.value;
    },
  },
  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
  },
};
