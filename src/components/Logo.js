import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {} from './Logo.css'

export default class Title extends Component {
  static propTypes = {
    small: PropTypes.bool,
  };

  render() {
    return (
      <div className='logo'>
        {this.props.small ? 'n:' : 'n:point'}
      </div>
    );
  }
}
