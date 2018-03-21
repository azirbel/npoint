// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdLock, MdReport } from 'react-icons/lib/md'
import { CSSTransitionGroup } from 'react-transition-group'
import _ from 'lodash'

import Button from '../../components/Button'
import JsonEditor from '../../components/JsonEditor'

import {} from './SchemaEditor.css'

export default class SchemaEditor extends Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    contentsEditable: PropTypes.bool.isRequired,
    errorMessage: PropTypes.string,
    onAutoformatSchema: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onOpenLockModal: PropTypes.func.isRequired,
    onRemoveSchema: PropTypes.func.isRequired,
    onTypingBreakpoint: PropTypes.func.isRequired,
    originalSchema: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
    showErrorMessage: PropTypes.bool,
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.props.onTypingBreakpoint)
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.props.onTypingBreakpoint)
  }

  handleSchemaChange = newValue => {
    this.props.onChange(newValue)
    this.debouncedOnChange()
  }

  // Call this when some amount of time has passed since the last text change
  // (when the user has stopped typing)
  debouncedOnChange = _.debounce(() => this.props.onTypingBreakpoint(), 1000)

  render() {
    return (
      <div className="schema-editor">
        {this.props.contentsEditable && (
          <div className="toolbar-container">
            <CSSTransitionGroup
              transitionName="example"
              transitionEnterTimeout={400}
              transitionLeaveTimeout={300}
            >
              {this.renderToolbar()}
            </CSSTransitionGroup>
          </div>
        )}
        <JsonEditor
          value={this.props.originalSchema}
          onChange={this.handleSchemaChange}
          onEnter={this.props.onTypingBreakpoint}
          readOnly={this.props.readOnly}
        />
      </div>
    )
  }

  renderToolbar() {
    if (this.props.document.schemaLocked) {
      return (
        <div key="toolbar-locked" className="badge dark-gray full-width">
          <MdLock className="toolbar-icon" />
          Locked
        </div>
      )
    } else if (this.props.showErrorMessage && this.props.errorMessage) {
      return (
        <div key="toolbar-error" className="badge warning full-width">
          <MdReport className="toolbar-icon" />
          {this.props.errorMessage}
        </div>
      )
    } else {
      return (
        <div key="toolbar-actions" className="button-group">
          <Button className="small" onClick={this.props.onAutoformatSchema}>
            Autoformat
          </Button>
          <Button className="small" onClick={this.props.onOpenLockModal}>
            Lock schema...
          </Button>
          <Button className="small" onClick={this.props.onRemoveSchema}>
            Remove schema
          </Button>
        </div>
      )
    }
  }
}
