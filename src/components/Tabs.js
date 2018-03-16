import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {} from './Tabs.css'

export class Tab extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    activeTabValue: PropTypes.string,
  }

  render() {
    let isActive = this.props.value === this.props.activeTabValue
    let onClickUnlessActive = () => {
      if (!isActive) {
        this.props.onClick(this.props.value)
      }
    }
    return (
      <div
        className={`tab ${isActive ? 'active' : ''}`}
        onClick={() => onClickUnlessActive()}
      >
        {this.props.children}
      </div>
    )
  }
}

export class Tabs extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    initialValue: PropTypes.string,
  }

  state = {
    activeTabValue: this.props.initialValue,
  }

  onClick(tabValue) {
    if (tabValue !== this.state.activeTabValue) {
      this.setState({ activeTabValue: tabValue })
      this.props.onChange(tabValue)
    }
  }

  render() {
    let childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onClick: tabValue => this.onClick(tabValue),
        activeTabValue: this.state.activeTabValue,
      })
    )
    return (
      <div className={`tabs ${this.props.fullWidth ? 'full-width' : ''}`}>
        {childrenWithProps}
      </div>
    )
  }
}
