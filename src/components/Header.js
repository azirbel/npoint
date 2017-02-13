import React, { Component } from 'react'
import { connect } from 'react-redux'
import { findDOMNode } from 'react-dom';
import { Link } from 'react-router'
import {} from './Header.css'
import Overlay from 'react-overlays/lib/Overlay'
import Tooltip from './Tooltip'

class Header extends Component {
  state = {
    show: false,
  }

  render() {
    return (
      <header className='header'>
        <div className={'container header-container' + (this.props.title ? ' small-logo' : '')}>
          <div className='logo'>
            {this.props.title ? (
              <div>
                <Link href='/' className='logo-img-container'>
                  <img className='logo-img' alt='logo' src='/img/logo.png' />
                </Link>
                <h1 className='inline-h1'>{this.props.title}</h1>
              </div>
            ) : (
              <Link href='/' className='logo-text'>
                <span className='logo-text-highlight'>n</span>
                point
              </Link>
            )}
          </div>
          <div>
            <div>
              {this.props.session.loggedIn ? (
                <Link to='/account'>Account</Link>
              ) : (
                <Link to='/session'>Log In</Link>
              )}
            </div>
            <button ref='target' onClick={() => this.setState({ show: true })}>
              Show
            </button>
            <Overlay
              show={this.state.show}
              placement={'bottom'}
              container={this}
              target={ props => findDOMNode(this.refs.target) }
            >
              <Tooltip>
                <div>
                  HI THERE
                </div>
              </Tooltip>
            </Overlay>
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
