import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {} from './Input.css'

// TODO(azirbel): Proptypes value, label, onChange
export default class Input extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
  }

  handleChange = e => {
    this.props.onChange(e.target.value)
  }

  render() {
    let inputClassName = `input-field ${this.props.label ? 'with-label' : ''}`
    return (
      <label className={`input ${this.props.className}`}>
        {this.props.label && this.props.label}
        &nbsp;
        <input
          className={inputClassName}
          type={this.props.type || 'text'}
          value={this.props.value}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
        />
      </label>
    )
  }
}
