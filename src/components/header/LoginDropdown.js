// @format

import React, { Component } from 'react'
import { MdArrowDropDown } from 'react-icons/lib/md'
import { findDOMNode } from 'react-dom'
import Overlay from 'react-overlays/lib/Overlay'
import Tooltip from '../Tooltip'
import Login from '../Login'
import {} from './LoginDropdown.css'

export default class LoginDropdown extends Component {
  state = {
    show: false,
  }

  onHide = () => {
    this.setState({ show: false })
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
            <Login onLogin={() => {}} />
          </Tooltip>
        </Overlay>
      </div>
    )
  }
}
