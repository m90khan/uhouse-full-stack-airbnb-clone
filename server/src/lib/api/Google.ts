import { google } from 'googleapis';
import { createClient, AddressComponent } from '@google/maps';

// maps client
const maps = createClient({ key: `${process.env.G_GEOCODE_KEY}`, Promise });
const parseAddress = (addressComponents: AddressComponent<any>[]) => {
  let country = null;
  let admin = null;
  let city = null;

  for (const component of addressComponents) {
    if (component.types.includes('country')) {
      country = component.long_name;
    }

    if (component.types.includes('administrative_area_level_1')) {
      admin = component.long_name;
    }

    if (component.types.includes('locality') || component.types.includes('postal_town')) {
      city = component.long_name;
    }
  }
  console.log(`parseAddress: ${country} ${admin} ${city}`);
  // return country, city and admin town
  return { country, admin, city };
};

/*
1- configure auth object
2- generate auth url
3- get user tokens and information (not storing tokens in db as not needed for other apis)
4- make request to google people api to get user infomation

*/

//1- configure auth object

const auth = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

export const Google = {
  // 2- generate auth url

  authUrl: auth.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'online',

    // If you only need one scope you can pass it as a string
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  }),
  // 3- get user tokens and information
  // make a request to Google using a "code" argument to get a user's access token
  logIn: async (code: string) => {
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);

    //4- make request to google people api
    const { data } = await google.people({ version: 'v1', auth }).people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names,photos',
    });
    return { user: data };
  },
  geocode: async (address: string) => {
    const res = await maps.geocode({ address }).asPromise();
    if (res.status < 200 || res.status > 299) {
      throw new Error('failed to geocode address');
    }
    console.log(res.json.results[0].address_components);
    return parseAddress(res.json.results[0].address_components);
  },
};
