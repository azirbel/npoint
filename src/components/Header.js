import React, { Component } from 'react'
import { Link } from 'react-router'
import {} from './Header.css'

export default class Header extends Component {
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
            <Link to='/account'>Account</Link>
          </div>
        </div>
      </header>
    );
  }
}
