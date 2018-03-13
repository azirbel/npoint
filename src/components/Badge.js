import React, { Component } from 'react'
import PropTypes from 'prop-types';
import {} from './Badge.css'

export default class Badge extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    classNames: PropTypes.string
  }

  render() {
    return (
      <div className={`badge-component ${this.props.classNames}`}>
        {this.props.label}
      </div>
    );
  }
}
