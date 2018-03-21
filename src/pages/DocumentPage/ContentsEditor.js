// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdReport } from 'react-icons/lib/md'
import { CSSTransitionGroup } from 'react-transition-group'
import _ from 'lodash'

import Button from '../../components/Button'
import JsonEditor from '../../components/JsonEditor'

import {} from './ContentsEditor.css'

export default class ContentsEditor extends Component {
  static propTypes = {
    canGenerateSchema: PropTypes.bool,
    onAutoformatContents: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onGenerateSchema: PropTypes.func.isRequired,
    onOpenLockModal: PropTypes.func.isRequired,
    originalContents: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
  }

  state = {
    showErrorMessage: false,
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleChangeOfFocusEvent)
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleChangeOfFocusEvent)
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.errorMessage) {
      this.setState({
        showErrorMessage: false,
      })
    }
  }

  handleContentsChange = newValue => {
    this.props.onChange(newValue)
    this.debouncedOnChange()
  }

  // Call this when some amount of time has passed since the last text change
  // (when the user has stopped typing)
  debouncedOnChange = _.debounce(() => this.handleChangeOfFocusEvent(), 1000)

  // Call this when we suspect the user has finished their WIP typing, so
  // we can show error messages at the most opportune time
  handleChangeOfFocusEvent = () => {
    this.setState({ showErrorMessage: true })
  }

  render() {
    return (
      <div className="contents-editor">
        {!this.props.readOnly && (
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
          value={this.props.originalContents}
          onChange={this.handleContentsChange}
          onEnter={this.handleChangeOfFocusEvent}
          readOnly={this.props.readOnly}
        />
      </div>
    )
  }

  renderToolbar() {
    if (this.state.showErrorMessage && this.props.errorMessage) {
      return (
        <div key="toolbar-error" className="badge warning full-width">
          <MdReport className="toolbar-icon" />
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
