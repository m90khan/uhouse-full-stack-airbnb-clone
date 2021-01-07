import { Request } from 'express';
import { Database, User } from '../types';

//CSRF  security function
/*

*/
export const Authorize = async (db: Database, req: Request): Promise<User | null> => {
  const token = req.get('X-CRSF-TOKEN');
  const viewer = await db.users.findOne({
    _id: req.signedCookies.viewer,
    token,
  });

  return viewer;
};
