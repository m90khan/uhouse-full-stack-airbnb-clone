import React from 'react';
import { Card, List, Skeleton } from 'antd';

import listingLoadingCardCover from '../../assets/listing-loading-card-cover.jpg';

export const HomeListingsSkeleton = () => {
  const emptyData = [{}, {}, {}, {}];

  // for skeleton, we mimick 4 objects data and
  //pass into the datasource for 4 listings skeletons
  return (
    <div className='home-listings-skeleton'>
      <Skeleton paragraph={{ rows: 0 }} />
      <List
        grid={{
          gutter: 24,
          xs: 1,
          sm: 2,
          lg: 4,
        }}
        dataSource={emptyData}
        renderItem={() => (
          <List.Item>
            <Card
              cover={
                <div
                  style={{ backgroundImage: `url(${listingLoadingCardCover})` }}
                  className='home-listings-skeleton__card-cover-img'
                ></div>
              }
              loading
            />
          </List.Item>
        )}
      />
    </div>
  );
};
