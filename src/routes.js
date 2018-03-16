// @format

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from './App'

import AccountPage from './pages/AccountPage'
import ChangelogPage from './pages/ChangelogPage'
import DocumentIndexPage from './pages/DocumentIndexPage'
import DocumentPage from './pages/DocumentPage'
import FaqPage from './pages/FaqPage'
import IndexPage from './pages/IndexPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import StyleguidePage from './pages/StyleguidePage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={IndexPage} />
    <Route path="/account" component={AccountPage} />
    <Route path="/changelog" component={ChangelogPage} />
    <Route path="/docs" component={DocumentIndexPage} />
    <Route path="/docs/:documentToken" component={DocumentPage} />
    <Route path="/faq" component={FaqPage} />
    <Route path="/reset-password" component={ResetPasswordPage} />
    <Route path="/style" component={StyleguidePage} />
  </Route>
)
