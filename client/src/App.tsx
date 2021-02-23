import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  AppHeader,
  Home,
  Listing,
  NotFound,
  User,
  Listings,
  Login,
  Stripe,
  Host,
} from './sections';
import { Affix, Layout, Spin } from 'antd';
import { Viewer } from './lib/types';
import { useMutation } from '@apollo/react-hooks';
import { LOG_IN } from './lib/graphql/mutations';
import { StripeProvider, Elements } from 'react-stripe-elements';

import {
  LogIn as LogInData,
  LogInVariables,
} from './lib/graphql/mutations/Login/__generated__/LogIn';
import { AppHeaderSkeleton, ErrorBanner } from './lib/components';
import Footer from './sections/Footer';
import { ScrollTop } from './lib/utils';

// viewer for access

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const AppRouter = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  //set cookie
  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn);

        if (data.logIn.token) {
          sessionStorage.setItem('token', data.logIn.token);
        } else {
          sessionStorage.removeItem('token');
        }
      }
    },
  });
  /*
  the logIn() should only runs when the App component is mounter, should be constant
  useRef will help in this regard to keep it constant
  */
  const logInRef = useRef(logIn);
  useEffect(() => {
    logInRef.current();
  }, []);

  // error status and didRequest : if user login or attempting to login then view spinner
  if (!viewer.didRequest && !error) {
    return (
      <Layout className='app-skeleton'>
        <AppHeaderSkeleton />
        <div className='app-skeleton__spin-section'>
          <Spin size='large' tip='Launching AirHouse' />
        </div>
      </Layout>
    );
  }
  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;
  return (
    // Router =  parent router
    <StripeProvider apiKey={process.env.REACT_APP_S_PUBLISHABLE_KEY as string}>
      <Router>
        <Layout id='app'>
          {logInErrorBannerElement}
          <Affix offsetTop={0} className='app__affix-header'>
            <AppHeader viewer={viewer} setViewer={setViewer} />
          </Affix>
          <ScrollTop />

          <Switch>
            <Route path='/' exact>
              <Home />
            </Route>
            <Route exact path='/host'>
              <Host viewer={viewer} />
            </Route>
            <Route exact path='/listing/:id'>
              <Elements>
                <Listing viewer={viewer} />
              </Elements>
            </Route>
            <Route path='/listings/:location?' exact>
              <Listings />
            </Route>
            <Route exact path='/login'>
              <Login setViewer={setViewer} />
            </Route>
            <Route exact path='/user/:id'>
              <User viewer={viewer} setViewer={setViewer} />
            </Route>
            <Route exact path='/stripe'>
              <Stripe viewer={viewer} setViewer={setViewer} />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
          <Footer />
        </Layout>
      </Router>
    </StripeProvider>
  );
};

function App() {
  return <AppRouter />;
}

export default App;

/*
invoke post and get http method. 
  - query executed parallel while mutation one after another
*/
