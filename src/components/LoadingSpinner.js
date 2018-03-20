// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {} from './LoadingSpinner.css'

// https://codepen.io/aurer/pen/jEGbA
export default class LoadingSpinner extends Component {
  static propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
  }

  render() {
    let className = `loading-spinner ${this.props.className}`
    let fillName = `fill-${this.props.color || 'light-black'}`

    return (
      <div className={className}>
        <svg
          version="1.1"
          id="loader-1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          viewBox="0 0 50 50"
        >
          <path
            className={fillName}
            d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    )
  }
}
