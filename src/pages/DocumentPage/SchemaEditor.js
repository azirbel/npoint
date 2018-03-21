// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MdLock } from 'react-icons/lib/md'
import { CSSTransitionGroup } from 'react-transition-group'

import Button from '../../components/Button'
import JsonEditor from '../../components/JsonEditor'

export default class SchemaEditor extends Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    contentsEditable: PropTypes.bool.isRequired,
    onAutoformatSchema: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onOpenLockModal: PropTypes.func.isRequired,
    onRemoveSchema: PropTypes.func.isRequired,
    originalSchema: PropTypes.string.isRequired,
    readOnly: PropTypes.bool,
  }

  render() {
    return (
      <div>
        {this.props.contentsEditable && (
          <div className="animated-button-container">
            <CSSTransitionGroup
              transitionName="example"
              transitionEnterTimeout={400}
              transitionLeaveTimeout={300}
            >
              {this.props.document.schemaLocked ? (
                <div key="a" className="badge full-width">
                  <MdLock className="locked-icon" />
                  Locked
                </div>
              ) : (
                <div key="b" className="button-group">
                  <Button
                    className="small"
                    onClick={this.props.onAutoformatSchema}
                  >
                    Autoformat
                  </Button>
                  <Button
                    className="small"
                    onClick={this.props.onOpenLockModal}
                  >
                    Lock schema...
                  </Button>
                  <Button
                    className="small"
                    onClick={this.props.onRemoveSchema}
                  >
                    Remove schema
                  </Button>
                </div>
              )}
            </CSSTransitionGroup>
          </div>
        )}
        <JsonEditor
          value={this.props.originalSchema}
          onChange={this.props.onChange}
          readOnly={this.props.readOnly}
        />
      </div>
    )
  }
}
