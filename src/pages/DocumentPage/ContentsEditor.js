// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from '../../components/Button'
import JsonEditor from '../../components/JsonEditor'

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

  render() {
    return (
      <div>
        {!this.props.readOnly && (
          <div className="button-group animated-button-container">
            <Button
              className="small"
              onClick={this.props.onAutoformatContents}
            >
              Autoformat
            </Button>
            <Button
              className="small"
              onClick={this.props.onOpenLockModal}
            >
              Lock data...
            </Button>
            {this.props.canGenerateSchema && (
              <Button
                className="small"
                onClick={this.props.onGenerateSchema}
              >
                Add schema
              </Button>
            )}
          </div>
        )}
        <JsonEditor
          value={this.props.originalContents}
          onChange={this.props.onChange}
          readOnly={this.props.readOnly}
        />
      </div>
    )
  }
}
