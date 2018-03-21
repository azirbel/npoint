// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactModal from 'react-modal'
import Button from '../../components/Button'

export default class ShareModal extends Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  }

  render() {
    return (
      <ReactModal
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        contentLabel="Share"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">Share</div>
        <div className="modal-body">
          <p>Access this document via the API at:</p>
          <p>
            <a target="_blank" href={this.props.document.apiUrl}>
              {this.props.document.apiUrl}
            </a>
          </p>
          <p>
            Anyone who has the URL (or API URL) is able to view the data and
            title of this document. If the document was created anonymously,
            anyone will be able to edit it; if it was created with your account,
            only you can edit it.
          </p>
          <div className="button-group">
            <Button className="primary" onClick={this.props.onClose}>
              Done
            </Button>
          </div>
        </div>
      </ReactModal>
    )
  }
}
