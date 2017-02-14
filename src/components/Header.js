import React, { Component } from 'react'
import { connect } from 'react-redux'
import {} from './Header.css'
import Title from './header/Title'
import LoginDropdown from './header/LoginDropdown'
import AccountDropdown from './header/AccountDropdown'

class Header extends Component {
  state = {
    show: false,
  }

  toggleShow() {
    this.setState({ show: !this.state.show })
  }

  render() {
    return (
      <header className='header'>
        <div className={'container header-container' + (this.props.title ? ' small-logo' : '')}>
          <Title title={this.props.title} />
          <div>
            {this.props.session.loggedIn ? (
              <AccountDropdown />
            ) : (
              <LoginDropdown />
            )}
          </div>
        </div>
      </header>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(Header)
