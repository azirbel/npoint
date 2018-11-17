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
        contentLabel="Lock JSON data"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">Lock JSON data</div>
        <div className="modal-body prose">
          <p className="medium">
            Once a bin is locked, it cannot be deleted and none of its data can
            ever be changed.
          </p>
          <p className="medium">
            You can always copy the bin later to keep editing under a different
            ID.
          </p>
          <p className="medium">
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
