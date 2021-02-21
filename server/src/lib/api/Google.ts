import { google } from 'googleapis';
// import { createClient, AddressComponent } from '@google/maps';
import {
  Client,
  AddressComponent,
  AddressType,
  GeocodingAddressComponentType,
} from '@googlemaps/google-maps-services-js';

// maps client
const maps = new Client({});

const parseAddress = (addressComponents: AddressComponent[]) => {
  let country = null;
  let admin = null;
  let city = null;

  for (const component of addressComponents) {
    if (component.types.includes(AddressType.country)) {
      country = component.long_name;
    }

    if (component.types.includes(AddressType.administrative_area_level_1)) {
      admin = component.long_name;
    }

    if (
      component.types.includes(AddressType.locality) ||
      component.types.includes(GeocodingAddressComponentType.postal_town)
    ) {
      city = component.long_name;
    }
  }

  return { country, admin, city };
};

/*   
LOGIN
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
  geoCode: async (address: string) => {
    if (!process.env.G_GEOCODE_KEY) throw new Error('missing Google Maps API key');

    const res = await maps.geocode({
      params: { address, key: process.env.G_GEOCODE_KEY },
    });

    if (res.status < 200 || res.status > 299) {
      throw new Error('failed to geocode address');
    }

    return parseAddress(res.data.results[0].address_components);
  },
};

// {
//   "results" : [
//      {
//         "address_components" : [
//            {
//               "long_name" : "1600",
//               "short_name" : "1600",
//               "types" : [ "street_number" ]
//            },
//            {
//               "long_name" : "Amphitheatre Pkwy",
//               "short_name" : "Amphitheatre Pkwy",
//               "types" : [ "route" ]
//            },
//            {
//               "long_name" : "Mountain View",
//               "short_name" : "Mountain View",
//               "types" : [ "locality", "political" ]
//            },
//            {
//               "long_name" : "Santa Clara County",
//               "short_name" : "Santa Clara County",
//               "types" : [ "administrative_area_level_2", "political" ]
//            },
//            {
//               "long_name" : "California",
//               "short_name" : "CA",
//               "types" : [ "administrative_area_level_1", "political" ]
//            },
//            {
//               "long_name" : "United States",
//               "short_name" : "US",
//               "types" : [ "country", "political" ]
//            },
//            {
//               "long_name" : "94043",
//               "short_name" : "94043",
//               "types" : [ "postal_code" ]
//            }
//         ],
//         "formatted_address" : "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA",
//         "geometry" : {
//            "location" : {
//               "lat" : 37.4224764,
//               "lng" : -122.0842499
//            },
//            "location_type" : "ROOFTOP",
//            "viewport" : {
//               "northeast" : {
//                  "lat" : 37.4238253802915,
//                  "lng" : -122.0829009197085
//               },
//               "southwest" : {
//                  "lat" : 37.4211274197085,
//                  "lng" : -122.0855988802915
//               }
//            }
//         },
//         "place_id" : "ChIJ2eUgeAK6j4ARbn5u_wAGqWA",
//         "plus_code": {
//            "compound_code": "CWC8+W5 Mountain View, California, United States",
//            "global_code": "849VCWC8+W5"
//         },
//         "types" : [ "street_address" ]
//      }
//   ],
//   "status" : "OK"
// }
