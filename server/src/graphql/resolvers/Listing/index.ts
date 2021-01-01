// import { listings } from '../listings';
import { ObjectId } from 'mongodb';

// Iresolvers  help defined types of resolver map
import { IResolvers } from 'apollo-server-express';
import { Database, Listing } from '../../../lib/types';
//  resolvers: just a map of object tthat relate with schema field that resolve that field

export const listingResolvers: IResolvers = {
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
      // filter by Object _id from database by converting the string id to hex number
      const deleteRes = await db.listings.findOneAndDelete({ _id: new ObjectId(id) });
      if (!deleteRes.value) {
        throw new Error('failed to delete listing');
      }
      return deleteRes.value;
    },
  },
  /* 
  resolve Listing Object type: the return values from QUery and mutation 
   are the object argument for the children fields.
   assign the Listing type from the return listing obj from the databse 
   Resolver functions that simply return a property from the resolver obj argument with the same name as the
ﬁeld being queried.
   - Apollo server allows the simple resolve functions to omit defining them where the 
   - object return the same value like title:(listing: Listing) = > listing.title 
   * but id field has to resolved as id is an objectID needed as string
*/
  Listing: {
    // id gets seralized as string in graphql type obj
    id: (listing: Listing): string => listing._id.toString(),
  },
};
