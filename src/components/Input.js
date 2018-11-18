import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {} from './Input.css'

export default class Input extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onEnter: PropTypes.func,
    onKeyPress: PropTypes.func,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    autoFocus: PropTypes.bool,
  }

  inputEl = null

  componentDidMount() {
    if (this.props.autoFocus) {
      this.inputEl.focus()
    }
  }

  handleChange = e => {
    this.props.onChange(e.target.value)
  }

  handleKeyPress = e => {
    if (this.props.onKeyPress) {
      this.props.onKeyPress()
    }

    if (this.props.onEnter && e.key === 'Enter') {
      this.props.onEnter()
    }
  }

  render() {
    let inputClassName = `input-field ${this.props.inputClassName} ${
      this.props.label ? 'with-label' : ''
    }`
    return (
      <label className={`input ${this.props.className}`}>
        {this.props.label && (
          <span>
            {this.props.label}
            &nbsp;
          </span>
        )}
        <input
          className={inputClassName}
          type={this.props.type || 'text'}
          value={this.props.value}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          placeholder={this.props.placeholder}
          ref={el => (this.inputEl = el)}
          onFocus={event => event.target.select()}
        />
      </label>
    )
  }
}
