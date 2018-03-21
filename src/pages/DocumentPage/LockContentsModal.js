// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import Button from '../../components/Button'

export default class LockContentsModal extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onLockContents: PropTypes.func.isRequired,
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        contentLabel="Lock JSON document"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">Lock JSON document</div>
        <div className="modal-body">
          <p>
            Once a document is locked, it cannot be deleted and none of its data
            (except the title) can be changed.
          </p>
          <p>
            You can always clone the document later to keep editing under a
            different ID.
          </p>
          <p>
            <strong>This action cannot be undone.</strong>
          </p>
          <div className="button-group">
            <Button
              className="primary danger"
              onClick={this.props.onLockContents}
              isLoading={this.props.isLoading}
            >
              Lock JSON data
            </Button>
            <Button onClick={this.props.onClose}>Cancel</Button>
          </div>
        </div>
      </ReactModal>
    )
  }
}
