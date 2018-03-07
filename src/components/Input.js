import React, { Component, PropTypes } from "react";
import {} from "./Input.css";

// TODO(azirbel): Proptypes value, label, onChange
export default class Input extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  handleChange = e => {
    this.props.onChange(e.target.value);
  };

  render() {
    return (
      <label className="input">
        {this.props.label}&nbsp;
        <input
          className="input-field"
          type={this.props.type || "text"}
          value={this.props.value}
          onChange={this.handleChange}
        />
      </label>
    );
  }
}
