import { IResolvers } from 'apollo-server-express';
import { UserArgs } from './types';
import { Database, User } from '../../../lib/types';
export const userResolvers: IResolvers = {
  Query: {
    user: async (
      _root: undefined,
      { id }: UserArgs,
      { db }: { db: Database }
    ): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: id });
        if (!user) {
          throw new Error("user can't be found");
        }
        return user;
      } catch (error) {
        throw new Error(`Failed to query user: ${error}`);
      }
    },
  },
};
