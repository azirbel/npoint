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
      <div>
        <button
          className='button link'
          ref='accountDropdownTarget'
          onClick={() => this.setState({ show: !this.state.show })}
        >
          {this.props.session.user.name}
          <MdArrowDropDown />
        </button>
        <Overlay
          show={this.state.show}
          placement={'bottom'}
          target={ props => findDOMNode(this.refs.accountDropdownTarget) }
          rootClose={true}
          onHide={() => this.setState({ show: false })}
        >
          <Tooltip>
            <div>
              <Link className='button' to='/account'>Account</Link>
            </div>
            <button className='button link' onClick={() => this.logOut()}>
              Log out
            </button>
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
