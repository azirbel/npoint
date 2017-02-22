import React, { Component } from 'react'
import { connect } from 'react-redux'
import {} from './Header.css'
import Title from './header/Title'
import LoginDropdown from './header/LoginDropdown'
import AccountDropdown from './header/AccountDropdown'
import Document from '../models/Document'
import { push } from 'react-router-redux'

class Header extends Component {
  state = {
    show: false,
  }

  toggleShow() {
    this.setState({ show: !this.state.show })
  }

  createDocument() {
    let { dispatch } = this.props
    Document.create({ title: 'Untitled', contents: '{}' }).then((response) => {
      dispatch(push(`/docs/${response.data.id}`))
    })
  }

  render() {
    return (
      <div>
        <header className='header'>
          <div className={'container header-container' + (this.props.title ? ' small-logo' : '')}>
            <Title title={this.props.title} />
            <div className='flex'>
              <button
                className='button primary'
                onClick={() => this.createDocument()}
              >
                + New
              </button>
              {this.props.session.loggedIn ? (
                <AccountDropdown />
              ) : (
                <LoginDropdown />
              )}
            </div>
          </div>
        </header>
        <div className='header-spacer'></div>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(Header)
