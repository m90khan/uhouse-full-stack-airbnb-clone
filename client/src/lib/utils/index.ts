import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { message, notification } from 'antd';

export const iconColor = '#1890ff';

export const formatListingPrice = (price: number, round = true) => {
  const formattedListingPrice = round ? Math.round(price / 100) : price / 100;
  return `$${formattedListingPrice}`;
};
export const displaySuccessNotification = (message: string, description?: string) => {
  return notification['success']({
    message,
    description,
    placement: 'topLeft',
    style: {
      marginTop: 50,
    },
  });
};

export const displayErrorMessage = (error: string) => {
  return message.error(error);
};

export const ScrollTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
    });
  }, [pathname]);
  return null;
};

/*
import { useLayoutEffect } from "react";

export const useScrollToTop = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

in component => useScrollToTop()
*/
