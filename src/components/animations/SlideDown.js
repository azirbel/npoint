// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CSSTransitionGroup } from 'react-transition-group'

import {} from './SlideDown.css'

export default class SlideDown extends Component {
  static propTypes = {
    className: PropTypes.string,
  }

  render() {
    return (
      <div className='slide-down-component'>
        <CSSTransitionGroup
          component="div"
          className={this.props.className}
          transitionName="slide-down"
          transitionEnterTimeout={400}
          transitionLeaveTimeout={300}
        >
          {this.props.children}
        </CSSTransitionGroup>
      </div>
    )
  }
}
