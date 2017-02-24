import React, { Component } from 'react';
import { MdArrowDropDown } from 'react-icons/lib/md'
import { findDOMNode } from 'react-dom';
import Overlay from 'react-overlays/lib/Overlay'
import Tooltip from '../Tooltip'
import Login from '../Login'

export default class LoginDropdown extends Component {
  state = {
    show: false,
  }

  render() {
    return (
      <div>
        <button
          className='button link'
          ref='target'
          onClick={() => this.setState({ show: !this.state.show })}
        >
          Log in
          <MdArrowDropDown />
        </button>
        <Overlay
          show={this.state.show}
          placement={'bottom'}
          target={ props => findDOMNode(this.refs.target) }
          rootClose={true}
          onHide={() => this.setState({ show: false })}
        >
          <Tooltip>
            <Login onLogin={() => {}}/>
          </Tooltip>
        </Overlay>
      </div>
    );
  }
}
