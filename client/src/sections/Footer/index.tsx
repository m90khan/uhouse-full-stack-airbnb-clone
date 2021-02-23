import React from 'react';
import { Row, Col, Tag, Divider } from 'antd';
import { footer } from './data';

import {
  TwitterOutlined,
  YoutubeOutlined,
  FacebookOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
export default function Footer() {
  return (
    <footer className='footer page-wrapper'>
      <div className='footer-wrap page'>
        <Row>
          {footer.map((foot: any, index: any) => (
            <Col key={index} lg={6} md={12} xs={24} className='footer-item-col'>
              <div className='footer-item' key={index}>
                <h2 key={index.toString()}>{foot.title}</h2>
                {foot.children.map((child: any) => (
                  <div key={child.link}>
                    <a
                      target='_blank '
                      href={child.link}
                      style={child.title === 'AirHouse' ? { fontWeight: 'bold' } : {}}
                    >
                      {child.title}
                    </a>
                  </div>
                ))}
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <div className='footer-bottom' style={{ textAlign: 'center' }}>
        <Row>
          <Col lg={24} xs={24} className='footer-item-col'>
            <Tag icon={<TwitterOutlined />} color='#55acee'>
              Twitter
            </Tag>
            <Tag icon={<YoutubeOutlined />} color='#cd201f'>
              Youtube
            </Tag>
            <Tag icon={<FacebookOutlined />} color='#3b5999'>
              Facebook
            </Tag>
            <Tag icon={<InstagramOutlined />} color='#2e2929'>
              Instagram
            </Tag>
          </Col>
          <Col lg={24} xs={24} style={{ marginTop: '.5rem' }}>
            <span>Copyright © 2020 - {new Date().getFullYear()}</span>
          </Col>
        </Row>
      </div>
    </footer>
  );
}
