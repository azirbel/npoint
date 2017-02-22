import React, { Component } from 'react'
import {} from './Input.css'

// TODO(azirbel): Proptypes value, label, onChange
export default class Input extends Component {
  handleChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <label className='input'>
        {this.props.label}&nbsp;
        <input
          className='input-field'
          value={this.props.value}
          onChange={this.handleChange}
        />
      </label>
    );
  }
}
