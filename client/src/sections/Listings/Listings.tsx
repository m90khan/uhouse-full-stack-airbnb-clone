// import { useQuery, useMutation } from '../../lib/api/index';
import { useQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';
// import { ListingsData, DeleteListingData, DeleteListingVariables } from './types';
import { Alert, Avatar, Button, List, Spin } from 'antd';
import { Listings as ListingsData } from './__generated__/Listings';
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from './__generated__/DeleteListing';
import './styles/Listings.css';
import { ListingsSkeleton } from './components';

interface Props {
  title: string;
}

// listing schema
// query Listings{ : we can name the query anything
const LISTINGS = gql`
  query Listings {
    listings {
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
const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
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
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <List
      itemLayout='horizontal'
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button type='primary' onClick={() => handleDeleteListing(listing.id)}>
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape='square' size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null;

  if (loading) {
    return (
      <div className='listings'>
        <ListingsSkeleton title={title} />
      </div>
    );
  }

  if (error) {
    return (
      <div className='listings'>
        <ListingsSkeleton title={title} error />
      </div>
    );
  }
  const deleteListingLoadingMessage = deleteListingLoading ? (
    <h2>Deleteing ... </h2>
  ) : null;
  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
      type='error'
      message='Uh oh! Something went wrong :(. Please try again later.'
      className='listings__alert'
    />
  ) : null;
  return (
    <div className='listings'>
      {deleteListingErrorAlert}
      <Spin spinning={deleteListingLoading}>
        <h2>{title}</h2>
        {listingsList}
      </Spin>
    </div>
  );
};
