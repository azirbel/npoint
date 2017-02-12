import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';

import AccountPage from './pages/AccountPage';
import DocumentIndexPage from './pages/DocumentIndexPage';
import DocumentPage from './pages/DocumentPage';
import IndexPage from './pages/IndexPage';
import SessionPage from './pages/SessionPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={IndexPage} />
    <Route path="/docs" component={DocumentIndexPage} />
    <Route path="/docs/:documentId" component={DocumentPage} />
    <Route path="/session" component={SessionPage} />
    <Route path="/account" component={AccountPage} />
  </Route>
);
