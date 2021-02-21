import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Input, Row, Typography } from 'antd';

import torontoImage from '../../assets/toronto.jpg';
import dubaiImage from '../../assets/dubai.jpg';
import losAngelesImage from '../../assets/los-angeles.jpg';
import londonImage from '../../assets/london.jpg';
import munichImage from '../../assets/munich.jpg';
import shanghaiImage from '../../assets/shanghai.jpg';
import sanfraImage from '../../assets/sanfrancisco.jpg';
import cancunImage from '../../assets/cancun-city.jpg';

const { Title } = Typography;
const { Search } = Input;

interface Props {
  onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: Props) => {
  return (
    <div className='home-hero'>
      <div className='home-hero__search'>
        <Title level={1} className='home-hero__title'>
          Find a place you will love to stay at
        </Title>
        <Search
          placeholder="Search by city 'San Francisco'"
          size='large'
          enterButton
          className='home-hero__search-input'
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className='home-hero__cards'>
        <Col xs={12} md={6}>
          <Link to='/listings/toronto'>
            <Card cover={<img alt='Toronto' src={torontoImage} />}>Toronto</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to='/listings/dubai'>
            <Card cover={<img alt='Dubai' src={dubaiImage} />}>Dubai</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to='/listings/los%20angeles'>
            <Card cover={<img alt='Los Angeles' src={losAngelesImage} />}>
              Los Angeles
            </Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to='/listings/london'>
            <Card cover={<img alt='London' src={londonImage} />}>London</Card>
          </Link>
        </Col>
      </Row>
      <Row gutter={12} className='home-hero__cards'>
        <Col xs={12} md={6}>
          <Link to='/listings/cancún'>
            <Card cover={<img alt='Cancún' src={cancunImage} />}>Cancún</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to='/listings/san%20francisco'>
            <Card cover={<img alt='San Francisco' src={sanfraImage} />}>
              San Francisco
            </Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to='/listings/shanghai'>
            <Card cover={<img alt='Shanghai' src={shanghaiImage} />}>Shanghai</Card>
          </Link>
        </Col>
        <Col xs={0} md={6}>
          <Link to='/listings/munich'>
            <Card cover={<img alt='Munich' src={munichImage} />}>Munich</Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
