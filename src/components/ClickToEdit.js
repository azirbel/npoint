// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Input from '../components/Input'
import { MdDone, MdEdit } from 'react-icons/lib/md'
import Button from './Button'
import {} from './Input.css'
import _ from 'lodash'
import {} from './ClickToEdit.css'

export default class ClickToEdit extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    isLoading: PropTypes.bool,
    inputClassName: PropTypes.string,
    textClassName: PropTypes.string,
  }

  state = {
    isEditing: false,
    newValue: '',
  }

  startEditing = () => {
    this.setState({
      isEditing: true,
      newValue: this.props.value,
    })
  }

  saveNewValue = () => {
    this.props.onChange(this.state.newValue)
    this.setState({
      isEditing: false,
    })
  }

  render() {
    let showInput = this.state.isEditing || this.props.isLoading
    let textClassName = `display-text ${this.props.textClassName}`

    return (
      <div className="click-to-edit">
        {showInput ? (
          <div className="flex align-stretch">
            <Input
              value={this.state.newValue}
              onEnter={this.saveNewValue}
              onChange={newValue => this.setState({ newValue })}
              inputClassName={this.props.inputClassName}
            />
            <Button
              className="subtle square edit-name-button"
              onClick={this.saveNewValue}
              isLoading={this.props.isLoading}
            >
              <MdDone />
            </Button>
          </div>
        ) : (
          <div className="flex align-stretch">
            <div className={textClassName}>{this.props.value}&nbsp;</div>
            {!this.props.readOnly && (
              <Button
                className="subtle square edit-name-button"
                onClick={this.startEditing}
              >
                <MdEdit />
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }
}
