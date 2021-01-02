import React, { FunctionComponent, useState } from 'react';
import { server } from '../../lib/api/index';
import { ListingsData, DeleteListingData, DeleteListingVariables } from './types';
interface Props {
  title: string;
}
// query Listings{ : we can name the query anything

const LISTINGS = `
query Listings{ 
listings{    
    id
    title
    image
    address
    price
    numOfGuests
    numOfBeds
     numOfBaths
    rating
}
}
`;

const DELETE_LISTING = `
mutation DeleteListing($id: ID! ){
    deleteListing(id: $id){
        id
    }
}
`;
export const Listings = ({ title }: Props) => {
  const [Lists, setLists] = useState<any[]>([]);
  const fetchListing = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS });
    setLists(data.listings);
    console.log(data.listings);
  };

  const deleteListing = async () => {
    const { data } = await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id: '5feed8a32641e8410070b0f9',
      },
    });
    console.log(data);
  };
  return (
    <div>
      <h2>AirHouse</h2>
      <h3>{title}</h3>
      {Lists.map((list) => (
        <h1 key={list.id}>{list.title}:string</h1>
      ))}
      <button onClick={() => fetchListing()}>Query Listings</button>
      <button onClick={() => deleteListing()}>Delete Listings</button>
    </div>
  );
};
// explicitly define the type of the Listing2 functional compoenent
// export const Listings2: FunctionComponent<Props> = ({ title }: Props) => {
//   return (
//     <div>
//       <h2>AirHouse</h2>
//       <h3>{title}</h3>
//     </div>
//   );
// };
