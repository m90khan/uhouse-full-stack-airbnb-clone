import { Collection, ObjectId } from 'mongodb';

// Type definitions for database

export interface Viewer {
  _id?: string;
  token?: string;
  avatar?: string;
  walletId?: string;
  didRequest: boolean;
}

export interface Booking {
  _id: ObjectId;
  listing: ObjectId; //   1-1 booking -> listing
  tenant: string; // 1-1 booking -> user
  checkIn: string;
  checkOut: string;
}

export enum ListingType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
}
export interface BookingsIndexMonth {
  [key: string]: boolean;
}
export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}
export interface BookingsIndex {
  [key: string]: BookingsIndexYear;
}
export interface Listing {
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  host: string; // 1-1 listing -> host
  type: ListingType;
  address: string;
  country: string;
  admin: string; // state or provinces for geo coding
  city: string;
  bookings: ObjectId[];
  bookingsIndex: BookingsIndex; // object of object
  price: number;
  numOfGuests: number;
}

/*      bookingsIndex: BookingsIndexYear;

Handling dates for bookings using index . if a house is boked then listing not possible
  const datePick ={
    "2019":{     // BookingsIndexYear    string
      "00":{   //BookingsIndexMonth   string
        "01" : true     //      boolean
      }
    }
  }
*/

export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  contact: string;
  walletId?: string;
  income: number;
  // 1-many : user -> bookings

  bookings: ObjectId[];
  listings: ObjectId[];
}

export interface Database {
  bookings: Collection<Booking>;
  listings: Collection<Listing>;
  users: Collection<User>;
}
