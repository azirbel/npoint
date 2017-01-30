import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import DocumentPage from './pages/DocumentPage';
import DocumentIndexPage from './pages/DocumentIndexPage';
import IndexPage from './pages/IndexPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={IndexPage} />
    <Route path="/documents" component={DocumentIndexPage} />
    <Route path="/documents/:documentId" component={DocumentPage} />
  </Route>
);
