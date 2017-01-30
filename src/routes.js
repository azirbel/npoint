import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import DocumentPage from './pages/DocumentPage';
import DocumentIndexPage from './pages/DocumentIndexPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DocumentIndexPage} />
    <Route path="/edit/**" component={DocumentPage} />
  </Route>
);
