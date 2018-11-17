import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MdArrowDropDown } from 'react-icons/lib/md'
import { findDOMNode } from 'react-dom'
import Overlay from 'react-overlays/lib/Overlay'
import { Link } from 'react-router'
import _ from 'lodash'

import Session from '../../models/Session'
import Tooltip from '../Tooltip'
import { logOut } from '../../actions'

import {} from './AccountDropdown.css'

class AccountDropdown extends Component {
  state = {
    show: false,
    lastAvatarUrl: '',
  }

  logOut() {
    let { dispatch } = this.props
    Session.logout().then(() => {
      dispatch(logOut())
    })
  }

  componentDidMount() {
    this.setLastAvatarUrl(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.setLastAvatarUrl(newProps)
  }

  // Make sure this component can still render as a user is logging out (it will still be rendered
  // to show the logout animation)
  setLastAvatarUrl(props) {
    let avatarUrl = _.get(props, ['session', 'user', 'avatarUrl'])
    if (avatarUrl) {
      this.setState({ lastAvatarUrl: avatarUrl })
    }
  }

  render() {
    let avatarUrl =
      _.get(this.props, ['session', 'user', 'avatarUrl']) ||
      this.state.lastAvatarUrl

    return (
      <div className="account-dropdown-component js-account-dropdown">
        <button
          className="button subtle account-dropdown-button"
          ref="accountDropdownTarget"
          onClick={() => this.setState({ show: !this.state.show })}
        >
          <div className="flex align-center">
            <img
              className="avatar account-dropdown-avatar"
              role="presentation"
              src={avatarUrl}
            />
            <MdArrowDropDown />
          </div>
        </button>
        <Overlay
          show={this.state.show}
          placement={'bottom'}
          target={props => findDOMNode(this.refs.accountDropdownTarget)}
          rootClose={true}
          onHide={() => this.setState({ show: false })}
          className="thing"
        >
          <Tooltip>
            <div className="account-dropdown-menu">
              <Link className="button subtle full-width text-left" to="/docs">
                My Documents
              </Link>
              <Link
                className="button subtle full-width text-left"
                to="/account"
              >
                Account
              </Link>
              <button
                className="button subtle full-width text-left"
                onClick={() => this.logOut()}
              >
                Log out
              </button>
            </div>
          </Tooltip>
        </Overlay>
      </div>
    )
  }
}

let mapStateToProps = state => {
  return {
    session: state.session,
  }
}

export default connect(mapStateToProps)(AccountDropdown)
