// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from '../../components/Button'
import Document from '../../models/Document'
import Header from '../../components/Header'
import ClickToEdit from '../../components/ClickToEdit'

import {} from './DocumentPageHeader.css'

export default class DocumentPageHeader extends Component {
  static propTypes = {
    contentsEditable: PropTypes.bool,
    document: PropTypes.object.isRequired,
    hasSaved: PropTypes.bool.isRequired,
    isSavingDocument: PropTypes.bool,
    onLoadDocument: PropTypes.func.isRequired,
    onOpenShareModal: PropTypes.func.isRequired,
    onSaveDocument: PropTypes.func.isRequired,
    title: PropTypes.string,
    titleEditable: PropTypes.bool,
  }

  state = {
    isSavingTitle: false,
  }

  saveNewTitle = newTitle => {
    this.setState({ isSavingTitle: true })

    return Document.update(this.props.document.token, {
      title: newTitle,
    }).then(({ data }) => {
      this.props.onLoadDocument(data)
      this.setState({
        isSavingTitle: false,
      })
    })
  }

  render() {
    return (
      <Header className='document-page-header' fullWidth={true}>
        <ClickToEdit
          value={this.props.title || ''}
          readOnly={!this.props.titleEditable}
          onChange={this.saveNewTitle}
          isLoading={this.state.isSavingTitle}
          textClassName="page-title"
          inputClassName="edit-title-input"
        />
        <div className="flex-spring" />
        {this.props.contentsEditable &&
          (this.props.hasSaved ? (
            <Button disabled className="cta disabled">
              Saved
            </Button>
          ) : (
            <Button isLoading={this.props.isSavingDocument}
              className="cta" onClick={this.props.onSaveDocument}>
              Save
            </Button>
          ))}
        <button className="button subtle" onClick={this.props.onOpenShareModal}>
          Share
        </button>
      </Header>
    )
  }
}
