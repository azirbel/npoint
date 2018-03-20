// @format

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import routes from './routes'
import configureStore from './store/configureStore'
import configureAxios from './helpers/configure-axios'
import ReactModal from 'react-modal'
import './styles/avatar.css'
import './styles/badge.css'
import './styles/banner.css'
import './styles/buttons.css'
import './styles/flex.css'
import './styles/form.css'
import './styles/grid.css'
import './styles/index.css'
import './styles/links.css'
import './styles/list.css'
import './styles/modal.css'
import './styles/sections.css'
import './styles/typography.css'
import './styles/variables.css'

configureAxios()

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

ReactModal.setAppElement('#root')

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('root')
)
