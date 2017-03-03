import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import { findDOMNode } from 'react-dom';
import Logo from '../Logo'
import Badge from '../Badge'
import Overlay from 'react-overlays/lib/Overlay'
import Tooltip from '../Tooltip'
import {} from './Title.css'

export default class Title extends Component {
  static propTypes = {
    title: PropTypes.string
  }

  state = {
    show: false,
  }

  render() {
    return (
      <div className='title-component'>
        {this.props.title ? (
          <div className='flex align-center'>
            <Link href='/' className='unstyled'>
              <div className='small-logo-container'>
                <Logo small={true} />
              </div>
            </Link>
            <h1 className='page-title'>{this.props.title}</h1>
          </div>
        ) : (
          <Logo />
        )}
        <button ref='alphaBadge' onClick={() => this.setState({ show: !this.state.show })}>
          <Badge classNames='title-badge warning' label='unsafe alpha' />
        </button>
        <Overlay
          show={this.state.show}
          placement={'bottom'}
          target={ props => findDOMNode(this.refs.alphaBadge) }
          rootClose={true}
          onHide={() => this.setState({ show: false })}
        >
          <Tooltip>
            <div className='alpha-warning-tooltip'>
              This project is in an early stage. Data you store may be deleted without
              warning; API endpoints aren't ready for production use yet.
            </div>
          </Tooltip>
        </Overlay>
      </div>
    );
  }
}
