import { useQuery, useMutation } from '../../lib/api/index';
import { ListingsData, DeleteListingData, DeleteListingVariables } from './types';
interface Props {
  title: string;
}

// listing schema
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
// Delete Listing query
const DELETE_LISTING = `
mutation DeleteListing($id: ID! ){
    deleteListing(id: $id){
        id
    }
}
`;
export const Listings = ({ title }: Props) => {
  // Custom Query
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS);
  // Custom mutation
  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING);

  const handleDeleteListing = async (id: string) => {
    // await server.fetch<DeleteListingData, DeleteListingVariables>({
    //   query: DELETE_LISTING,
    //   variables: {
    //     id: id,
    //   },
    // });
    await deleteListing({ id });
    refetch();
  };

  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <ul>
      {listings.map((listing) => {
        return (
          <li key={listing.id}>
            {listing.title}
            <button onClick={() => handleDeleteListing(listing.id)}>Delete </button>
          </li>
        );
      })}
    </ul>
  ) : null;

  if (loading) {
    return <h2>Loading . . . </h2>;
  }
  if (error) {
    return <h2>Oh no: </h2>;
  }
  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h2>Deleteing ... </h2>
  ) : null;
  const deleteListingErrorMessage = deleteListingError ? (
    <h2>Oh no : went wrong with deleting try again ... </h2>
  ) : null;
  return (
    <div>
      <h2>AirHouse</h2>
      <h3>{title}</h3>
      {listingsList}
      {deleteListingLoadingMessage}
      {deleteListingErrorMessage}
    </div>
  );
};
