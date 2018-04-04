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
        overlayClassName="modal-overlay prose"
      >
        <div className="modal-header">Lock schema</div>
        <div className="modal-body">
          <p className="medium">
            Once a schema is locked, the bin cannot be deleted and the
            schema cannot be changed again. The JSON data can still be edited,
            but can only be saved if it matches the schema.
          </p>
          <p className="medium">
            You can always copy the bin later to make a version with a
            different schema.
          </p>
          <p className="medium">
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
