import React, { Component } from 'react'
import { connect } from 'react-redux'
import {} from './Header.css'
import Logo from './Logo'
import { Link } from 'react-router'
import LoginDropdown from './header/LoginDropdown'
import AccountDropdown from './header/AccountDropdown'

class Header extends Component {
  render() {
    let { session, children, fullWidth, fullLogo } = this.props;

    let headerClass = 'header-container'
      + (fullWidth ? ' header-gutter' : ' container')
      + (children ? ' small-logo' : '')

    return (
      <div>
        <header className='header'>
          <div className={headerClass}>
            {fullLogo ? (
              <Logo />
            ) : (
              <Link href='/' className='unstyled'>
                <div className='small-logo-container'>
                  <Logo small={true} />
                </div>
              </Link>
            )}
            {children}
            {session.loggedIn ? (
              <AccountDropdown />
            ) : (
              <LoginDropdown />
            )}
          </div>
        </header>
        <div className='header-spacer'></div>
      </div>
    );
  }

  renderTitle() {
    return (
      <div>
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(Header)
