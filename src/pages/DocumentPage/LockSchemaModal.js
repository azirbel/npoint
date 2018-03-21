// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import Button from '../../components/Button'

export default class LockSchemaModal extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onLockSchema: PropTypes.func.isRequired,
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        contentLabel="Lock schema"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">Lock schema</div>
        <div className="modal-body">
          <p>
            Once a schema is locked, the document cannot be deleted and the
            schema cannot be changed again. The JSON data can still be edited,
            but must always conform to the schema.
          </p>
          <p>
            You can always clone the document later to change the schema under a
            different ID.
          </p>
          <p>
            <strong>This action cannot be undone.</strong>
          </p>
          <div className="button-group">
            <Button
              className="primary danger"
              onClick={this.props.onLockSchema}
              isLoading={this.props.isLoading}
            >
              Lock schema
            </Button>
            <Button onClick={this.props.onClose}>Cancel</Button>
          </div>
        </div>
      </ReactModal>
    )
  }
}
