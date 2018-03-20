// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LoadingSpinner from './LoadingSpinner'

export default class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    onClick: PropTypes.func,
  }

  handleClick = () => {
    if (!this.props.isLoading && this.props.onClick) {
      this.props.onClick()
    }
  }

  render() {
    let className = `button ${this.props.className}`
    let loadingName = `button-loading ${this.props.isLoading ? 'visible' : ''}`

    return (
      <button className={className} onClick={this.handleClick}>
        {this.props.children}
        <LoadingSpinner className={loadingName} />
      </button>
    )
  }
}
