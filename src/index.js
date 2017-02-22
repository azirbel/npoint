/* global axios */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './store/configureStore';
import './styles/variables.css';
import './styles/index.css';
import './styles/buttons.css';
import './styles/flex.css';
import './styles/sections.css';
import './styles/typography.css';
import './styles/links.css';
import './styles/grid.css';
import './styles/form.css';

// TODO(azirbel): Standardize where this goes (it's also in an html
// script tag)
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.delete['Content-Type'] = 'application/json';

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
);
