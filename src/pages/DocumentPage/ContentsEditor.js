// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdReportProblem } from 'react-icons/lib/md'
import _ from 'lodash'

import Button from '../../components/Button'
import JsonEditor from '../../components/JsonEditor'
import SlideDown from '../../components/animations/SlideDown'

import {} from './ContentsEditor.css'

export default class ContentsEditor extends Component {
  static propTypes = {
    canGenerateSchema: PropTypes.bool,
    onAutoformatContents: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onGenerateSchema: PropTypes.func.isRequired,
    onOpenLockModal: PropTypes.func.isRequired,
    onSave: PropTypes.func,
    onTypingBreakpoint: PropTypes.func.isRequired,
    originalContents: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    showErrorMessage: PropTypes.bool,
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.props.onTypingBreakpoint)
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.props.onTypingBreakpoint)
  }

  handleContentsChange = newValue => {
    this.props.onChange(newValue)
    this.debouncedOnChange()
  }

  // Call this when some amount of time has passed since the last text change
  // (when the user has stopped typing)
  debouncedOnChange = _.debounce(() => this.props.onTypingBreakpoint(), 1000)

  render() {
    return (
      <div className="contents-editor">
        {!this.props.readOnly && (
          <div className="toolbar-container">
            <SlideDown>{this.renderToolbar()}</SlideDown>
          </div>
        )}
        <JsonEditor
          value={this.props.originalContents}
          onChange={this.handleContentsChange}
          onEnter={this.props.onTypingBreakpoint}
          onSave={this.props.onSave}
          readOnly={this.props.readOnly}
        />
      </div>
    )
  }

  renderToolbar() {
    if (this.props.showErrorMessage && this.props.errorMessage) {
      return (
        <div key="toolbar-error" className="badge warning full-width">
          <MdReportProblem className="toolbar-icon" />
          {this.props.errorMessage}
        </div>
      )
    } else {
      return (
        <div key="toolbar-actions" className="button-group">
          <Button className="small" onClick={this.props.onAutoformatContents}>
            Autoformat
          </Button>
          <Button className="small" onClick={this.props.onOpenLockModal}>
            Lock data...
          </Button>
          {this.props.canGenerateSchema && (
            <Button className="small" onClick={this.props.onGenerateSchema}>
              Add schema
            </Button>
          )}
        </div>
      )
    }
  }
}
