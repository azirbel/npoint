import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { logIn } from './actions'
import User from './models/User'
import {} from './App.css'

class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  componentDidMount() {
    let { dispatch } = this.props
    User.get(1).then((response) => {
      if (response.data && response.data.name) {
        dispatch(logIn(response.data))
      }
    })

  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(App)
