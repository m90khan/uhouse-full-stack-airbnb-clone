import { listings } from '../listings';
// Iresolvers  help defined types of resolver map
import { IResolvers } from 'apollo-server-express';
//  resolvers: just a map of object tthat relate with schema field that resolve that field

export const resolvers: IResolvers = {
  Query: {
    listings: () => {
      return listings;
    },
  },
  Mutation: {
    /*
      Apollo server : args types arenot explicitly defined
root:   The object returned from the resolver on the parent ﬁeld. set to undefined 
 we haven't defined it 
      */
    deleteListing: (_root: undefined, { id }: { id: string }) => {
      for (let i = 0; i < listings.length; i++) {
        if (listings[i].id === id) {
          return listings.splice(i, 1)[0];
        }
      }
      throw new Error('failed to delete listing');
    },
  },
};
