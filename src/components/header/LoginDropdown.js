// @format

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MdArrowDropDown } from 'react-icons/lib/md'
import { findDOMNode } from 'react-dom'
import { push } from 'react-router-redux'
import Overlay from 'react-overlays/lib/Overlay'
import _ from 'lodash'

import Tooltip from '../Tooltip'
import Login from '../Login'

import {} from './LoginDropdown.css'

class LoginDropdown extends Component {
  state = {
    show: false,
  }

  onHide = () => {
    this.setState({ show: false })
  }

  onLogin = () => {
    let pathname = _.get(this.props, ['routing', 'locationBeforeTransitions', 'pathname'])
    let hasDocs = _.get(this.props, ['session', 'user', 'hasDocuments'])
    if (pathname === '/' && hasDocs) {
      // Timeout so the login animation can finish
      setTimeout(() => {
        this.props.dispatch(push('/docs'))
      }, 400)
    }
  }

  render() {
    return (
      <div className="login-dropdown-component">
        <button
          className="button subtle"
          ref="target"
          onClick={() => this.setState({ show: !this.state.show })}
        >
          Log in
          <MdArrowDropDown />
        </button>
        <Overlay
          show={this.state.show}
          placement={'bottom'}
          target={props => findDOMNode(this.refs.target)}
          rootClose={true}
          onHide={this.onHide}
        >
          <Tooltip>
            <Login onLogin={this.onLogin} />
          </Tooltip>
        </Overlay>
      </div>
    )
  }
}

let mapStateToProps = state => {
  return {
    session: state.session,
    routing: state.routing,
  }
}

export default connect(mapStateToProps)(LoginDropdown)
