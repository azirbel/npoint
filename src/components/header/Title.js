import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import Logo from '../Logo'
import {} from './Title.css'

export default class Title extends Component {
  static propTypes = {
    title: PropTypes.string
  };

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
      </div>
    );
  }
}
