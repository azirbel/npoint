// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import Button from '../../components/Button'

export default class LeaveModal extends Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onDiscard: PropTypes.func.isRequired,
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        contentLabel="Unsaved Changes"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">Unsaved Changes</div>
        <div className="modal-body prose">
          <p className="medium">
            Warning: your bin has unsaved changes, which will be lost if
            you leave.
          </p>
          <div className="button-group">
            <Button className="danger" onClick={this.props.onDiscard}>
              Discard and continue
            </Button>
            <Button onClick={this.props.onClose}>Keep editing</Button>
          </div>
        </div>
      </ReactModal>
    )
  }
}
