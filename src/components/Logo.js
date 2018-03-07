import React, { Component, PropTypes } from "react";
import {} from "./Logo.css";

export default class Title extends Component {
  static propTypes = {
    small: PropTypes.bool
  };

  render() {
    return <div className="logo">{this.props.small ? "n:" : "n:point"}</div>;
  }
}
