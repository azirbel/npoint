import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './App';
import Document from './components/Document';
import DocumentIndex from './components/DocumentIndex';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DocumentIndex} />
    <Route path="/edit/**" component={Document} />
  </Route>
);
