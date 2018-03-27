// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { logIn, logOut } from './actions'
import User from './models/User'

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  }

  componentDidMount() {
    let { dispatch } = this.props
    User.me().then(
      response => {
        if (response.data && response.data.name) {
          dispatch(logIn(response.data))
        } else {
          dispatch(logOut())
        }
      },
      error => {}
    )
  }

  render() {
    return (
      <div>
        <Helmet defaultTitle="n:point JSON storage" />
        {this.props.children}
      </div>
    )
  }
}

let mapStateToProps = state => {
  return {
    session: state.session,
  }
}

export default connect(mapStateToProps)(App)
