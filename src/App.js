// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logIn } from './actions'
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
        }
      },
      error => {}
    )
  }

  render() {
    return <div>{this.props.children}</div>
  }
}

let mapStateToProps = state => {
  return {
    session: state.session,
  }
}

export default connect(mapStateToProps)(App)
