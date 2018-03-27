// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { CSSTransitionGroup } from 'react-transition-group'

import Logo from './Logo'
import LoginDropdown from './header/LoginDropdown'
import AccountDropdown from './header/AccountDropdown'

import {} from './Header.css'

class Header extends Component {
  // TODO(azirbel): Add more proptypes
  static propTypes = {
    className: PropTypes.string,
  }

  render() {
    let { className, session, children, fullWidth, fullLogo } = this.props

    let headerClass =
      'header-container container' +
      (fullWidth ? ' full-width' : '') +
      (children ? ' small-logo' : '')

    return (
      <div className={className}>
        <header className="header">
          <div className={headerClass}>
            {fullLogo ? (
              <Logo />
            ) : (
              <Link to="/" className="unstyled">
                <div className="small-logo-container">
                  <Logo small={true} />
                </div>
              </Link>
            )}
            {children}
            <div className="account-login-container">
              <CSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={400}
                transitionLeaveTimeout={300}
              >
                {session.loggedIn ? (
                  <AccountDropdown key="acc" />
                ) : (
                  <LoginDropdown key="login" />
                )}
              </CSSTransitionGroup>
            </div>
          </div>
        </header>
        <div className="header-spacer" />
      </div>
    )
  }
}

let mapStateToProps = state => {
  return {
    session: state.session,
  }
}

export default connect(mapStateToProps)(Header)
