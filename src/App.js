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
    User.me().then(
      response => {
        if (response.data && response.data.name) {
          this.props.dispatch(logIn(response.data))
        } else {
          this.props.dispatch(logOut())
        }
      },
      error => {}
    )
  }

  render() {
    return (
      <div>
        <Helmet defaultTitle="npoint.io - JSON storage with schema validation" />
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
