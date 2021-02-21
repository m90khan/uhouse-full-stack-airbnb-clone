import { Request } from 'express';
import { Database, User } from '../types';

//CSRF  security function
/*
Use cookie as to avoid CSRF attacks

1- Use cookie-parser with a secret on top
2- Add req, res to the context in ApolloServer instant
3- Create cookie Options and set cookie in logIn mutation when login via google is successful
4- Whenever a user attemping for login,  we check if we have code from in the request then start new login else we access cookies via another function.

     const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookie(token, db, req, res);

5- setup  'X-CSRF-TOKEN': token || '',
 on the client using sessionStorage and send it on every request to further protect from CSRF attack
*/
export const authorize = async (db: Database, req: Request): Promise<User | null> => {
  const token = req.get('X-CSRF-TOKEN');
  const viewer = await db.users.findOne({
    _id: req.signedCookies.viewer,
    token,
  });

  return viewer;
};
