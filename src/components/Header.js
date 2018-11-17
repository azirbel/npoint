import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import Logo from './Logo'
import LoginDropdown from './header/LoginDropdown'
import AccountDropdown from './header/AccountDropdown'
import SlideDown from '../components/animations/SlideDown'

import {} from './Header.css'

class Header extends Component {
  static propTypes = {
    className: PropTypes.string,
    session: PropTypes.object,
    fullWidth: PropTypes.bool,
    fullLogo: PropTypes.bool,
  }

  render() {
    let headerClass =
      'header-container container' +
      (this.props.fullWidth ? ' full-width' : '') +
      (this.props.children ? ' small-logo' : '')

    return (
      <div className={this.props.className}>
        <header className="header">
          <div className={headerClass}>
            {this.props.fullLogo ? (
              <Logo />
            ) : (
              <Link to="/" className="unstyled">
                <div className="small-logo-container">
                  <Logo small={true} />
                </div>
              </Link>
            )}
            {this.props.children}
            <div className="user-info-container">
              {this.props.session.loaded && (
                <SlideDown>
                  {this.props.session.loggedIn ? (
                    <AccountDropdown key="acc" />
                  ) : (
                    <LoginDropdown key="login" />
                  )}
                </SlideDown>
              )}
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
