import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router'
import {} from './Title.css'

export default class Title extends Component {
  static propTypes = {
    title: PropTypes.string
  };

  render() {
    return (
      <div>
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
    );
  }
}
