import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, Host, Listing, NotFound, User, Listings, Login } from './sections';
import { Affix, Layout, Spin } from 'antd';
import { Viewer } from './lib/types';
import { useMutation } from '@apollo/react-hooks';
import { LOG_IN } from './lib/graphql/mutations';

import {
  LogIn as LogInData,
  LogInVariables,
} from './lib/graphql/mutations/Login/__generated__/LogIn';
import { AppHeader } from './sections/AppHeader';
import { AppHeaderSkeleton, ErrorBanner } from './lib/components';
import Footer from './sections/Footer';

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

  // error status and didRequest : if user login or attemping to login
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
    <Router>
      <Layout id='app'>
        {logInErrorBannerElement}

        <Affix offsetBottom={0} className='app__affix-header'>
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/host' component={Host} exact />
          <Route path='/listing/:id' component={Listing} exact />
          <Route path='/listings/:location?' component={Listings} exact />

          <Route
            exact
            path='/user/:id'
            render={(props) => <User {...props} viewer={viewer} />}
          />
          <Route
            exact
            path='/login'
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <div>
      <AppRouter />;
      <Footer />
    </div>
  );
}

export default App;

/*
invoke post and get http method. 
  - query executed parallel while mutation one after another
*/
