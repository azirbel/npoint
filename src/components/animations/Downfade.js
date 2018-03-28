// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

import {} from './Downfade.css'

export default class Downfade extends Component {
  static propTypes = {
    className: PropTypes.string,
  }

  render() {
    let className = `downfade-component ${this.props.className || ''}`

    return (
      <CSSTransitionGroup
        component="div"
        className={className}
        transitionName="downfade"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={1}
      >
        {this.props.children}
      </CSSTransitionGroup>
    )
  }
}
