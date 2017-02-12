import React, { Component } from 'react'

// TODO(azirbel): Proptypes value, label, onChange
export default class Input extends Component {
  handleChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <label>
        {this.props.label}&nbsp;
        <input value={this.props.value} onChange={this.handleChange}/>
      </label>
    );
  }
}
