import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Home, Host, Listing, NotFound, User, Listings } from './sections';

const AppRouter = () => {
  return (
    // Router =  parent router
    <Router>
      <Switch>
        <Route path='/' component={Home} exact />
        <Route path='/host' component={Host} exact />
        <Route path='/listing/:id' component={Listing} exact />
        <Route path='/listings/:location?' component={Listings} exact />
        <Route path='/user/:id' component={User} exact />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
};

function App() {
  return (
    <div className='App'>
      <AppRouter />
    </div>
  );
}

export default App;

/*
invoke post and get http method. 
  - query executed parallel while mutation one after another
*/
