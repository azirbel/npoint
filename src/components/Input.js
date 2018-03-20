// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {} from './Input.css'

export default class Input extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onKeyPress: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
  }

  handleChange = e => {
    this.props.onChange(e.target.value)
  }

  render() {
    let inputClassName = `input-field ${this.props.inputClassName} ${this.props.label ? 'with-label' : ''}`
    return (
      <label className={`input ${this.props.className}`}>
        {this.props.label && (
          <span>{this.props.label}&nbsp;</span>
        )}
        <input
          className={inputClassName}
          type={this.props.type || 'text'}
          value={this.props.value}
          onChange={this.handleChange}
          onKeyPress={this.props.onKeyPress}
          placeholder={this.props.placeholder}
        />
      </label>
    )
  }
}
