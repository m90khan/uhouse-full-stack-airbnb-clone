import { IResolvers } from 'apollo-server-express';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { Viewer, Database, User } from '../../../lib/types';
import { Google, Stripe } from '../../../lib/api';
import { LogInArgs, ConnectStripeArgs } from './types';
import { authorize } from '../../../lib/utils/index';
/*
CSRF 
1- use secure to only https when not in developement
2- use sameSite : cookie can only be sent from same Site the user is viewing 
3- client pass in csrf token with every requet and server will use the token to verify the identity



*/
const cookieOptions = {
  httpOnly: true,
  sameSite: true, // no csrf
  signed: true, // cookie not tempered hmac value and encode
  secure: process.env.NODE_ENV === 'development' ? false : true,
};

const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response
): Promise<User | undefined> => {
  const { user } = await Google.logIn(code);
  if (!user) {
    throw new Error('Google login Error');
  }
  // Name/Photo/Email Lists
  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotosList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length ? user.emailAddresses : null;

  // User Display Name
  const userName = userNamesList ? userNamesList[0].displayName : null;

  // User Id
  const userId =
    userNamesList && userNamesList[0].metadata && userNamesList[0].metadata.source
      ? userNamesList[0].metadata.source.id
      : null;

  // User Avatar
  const userAvatar =
    userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

  // User Email
  const userEmail =
    userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error('Google login failed error');
  }

  const updateRes = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { returnOriginal: false }
  );

  let viewer = updateRes.value;

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });
    // inserted document can be get at ops array
    viewer = insertResult.ops[0];
  }
  res.cookie('viewer', userId, {
    ...cookieOptions,
    maxAge: 45 * 24 * 60 * 60 * 1000, //  45 days
  });
  return viewer;
};

const logInViaCookie = async (
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | undefined> => {
  const updatedRes = await db.users.findOneAndUpdate(
    { _id: req.signedCookies.viewer },
    { $set: { token } },
    { returnOriginal: false }
  );

  const viewer = updatedRes.value;
  if (!viewer) {
    res.clearCookie('viewer', cookieOptions);
  }
  return viewer;
};

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, req, res }: { db: Database; req: Request; res: Response }
    ): Promise<Viewer> => {
      /*
      Two Cases : 1- Where the viewer signs-in with the Google authentication url and consent screen.
                  2- Where the viewer signs-in with their cookie session.
      */
      try {
        const code = input ? input.code : null;
        // random string to use as a session token.
        const token = crypto.randomBytes(16).toString('hex');
        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookie(token, db, req, res);
        if (!viewer) {
          return { didRequest: true };
        }
        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Falied to log in ${error}`);
      }
    },
    logOut: (_root: undefined, _args: {}, { res }: { res: Response }): Viewer => {
      try {
        res.clearCookie('viewer', cookieOptions);
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Falied to log out ${error}`);
      }
    },
    connectStripe: async (
      _root: undefined,
      { input }: ConnectStripeArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<Viewer> => {
      try {
        const { code } = input;

        let viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error('viewer cannot be found');
        }

        const wallet = await Stripe.connect(code);
        if (!wallet) {
          throw new Error('stripe grant error');
        }

        const updateRes = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $set: { walletId: wallet.stripe_user_id } },
          { returnOriginal: false }
        );

        if (!updateRes.value) {
          throw new Error('viewer could not be updated');
        }

        viewer = updateRes.value;

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to connect with Stripe: ${error}`);
      }
    },
    disconnectStripe: async (
      _root: undefined,
      _args: {},
      { db, req }: { db: Database; req: Request }
    ): Promise<Viewer> => {
      try {
        let viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error('viewer cannot be found');
        }

        const updateRes = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          { $set: { walletId: undefined } },
          { returnOriginal: false }
        );

        if (!updateRes.value) {
          throw new Error('viewer could not be updated');
        }

        viewer = updateRes.value;

        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to disconnect with Stripe: ${error}`);
      }
    },
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
    hasWallet: (viewer: Viewer): boolean | undefined => {
      return viewer.walletId ? true : undefined;
    },
  },
};
