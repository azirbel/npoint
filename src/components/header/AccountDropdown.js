import React, { Component } from 'react';
import { connect } from 'react-redux'
import { MdArrowDropDown } from 'react-icons/lib/md'
import { findDOMNode } from 'react-dom';
import Overlay from 'react-overlays/lib/Overlay'
import { Link } from 'react-router'
import Session from '../../models/Session'
import Tooltip from '../Tooltip'
import { logOut } from '../../actions'
import { push } from 'react-router-redux'
import {} from './AccountDropdown.css'

class AccountDropdown extends Component {
  state = {
    show: false,
  }

  logOut() {
    let { dispatch } = this.props
    Session.logout().then(() => {
      // TODO(azirbel): Put the redirect dispatch inside the logOut one
      dispatch(logOut())
      dispatch(push('/'))
    })
  }

  render() {
    return (
      <div className='account-dropdown-component'>
        <button
          className='button link account-dropdown-button'
          ref='accountDropdownTarget'
          onClick={() => this.setState({ show: !this.state.show })}
        >
          <div className='flex align-center'>
            <img className='avatar account-dropdown-avatar'
              alt={this.props.session.user.name}
              src={this.props.session.user.avatarUrl}
            />
            <MdArrowDropDown />
          </div>
        </button>
        <Overlay
          show={this.state.show}
          placement={'bottom'}
          target={ props => findDOMNode(this.refs.accountDropdownTarget) }
          rootClose={true}
          onHide={() => this.setState({ show: false })}
        >
          <Tooltip>
            <div className='account-dropdown-menu'>
              <Link
                className='button link full-width text-left'
                to='/docs'
              >
                My Documents
              </Link>
              <Link
                className='button link full-width text-left'
                to='/account'
              >
                Account
              </Link>
              <button
                className='button link full-width text-left'
                onClick={() => this.logOut()}
              >
                Log out
              </button>
            </div>
          </Tooltip>
        </Overlay>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(AccountDropdown)
