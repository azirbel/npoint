// @format

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MdLock } from 'react-icons/lib/md'
import {} from './DocumentPage.css'
import _ from 'lodash'

import ClickToEdit from '../components/ClickToEdit'
import Document from '../models/Document'
import Header from '../components/Header'
import PageLoadingPlaceholder from '../components/PageLoadingPlaceholder'
import Schema from '../models/Schema'

import ContentsEditor from './DocumentPage/ContentsEditor'
import LockContentsModal from './DocumentPage/LockContentsModal'
import LockSchemaModal from './DocumentPage/LockSchemaModal'
import SchemaEditor from './DocumentPage/SchemaEditor'
import SchemaPlaceholder from './DocumentPage/SchemaPlaceholder'
import ShareModal from './DocumentPage/ShareModal'

class DocumentPage extends Component {
  state = {
    contents: null,
    contentsErrorMessage: '',
    document: {},
    isEditingTitle: false,
    isLoading: false,
    isSavingTitle: false,
    lockdownContentsModalVisible: false,
    lockdownSchemaModalVisible: false,
    originalContents: '',
    originalSchema: '',
    savedOriginalContents: '',
    savedOriginalSchema: '',
    schema: null,
    schemaErrorMessage: '',
    serverErrors: [],
    openModalName: null,
    modalActionInProgress: false,
  }

  loadDocument(token) {
    this.setState({ isLoading: true })
    Document.get(token).then(({ data }) => this.onLoadDocument(data))
  }

  onLoadDocument = (data) => {
    this.setState({
      contents: data.contents,
      document: data,
      isLoading: false,
      originalContents: data.originalContents,
      originalSchema: data.originalSchema,
      savedOriginalContents: data.originalContents,
      savedOriginalSchema: data.originalSchema,
      schema: data.schema,
    })
  }

  componentDidMount() {
    this.loadDocument(this.props.params.documentToken)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.params.documentToken !== this.props.params.documentToken) {
      this.loadDocument(newProps.params.documentToken)
    }
  }

  autoformatContents = () => {
    this.setState({
      originalContents: JSON.stringify(this.state.contents, null, 2),
    })
  }

  autoformatSchema = () => {
    this.setState({
      originalSchema: JSON.stringify(this.state.schema, null, 2),
    })
  }

  updateContents = (newOriginalContents, newJson, errorMessage) => {
    this.setState({
      contents: newJson,
      contentsErrorMessage: errorMessage,
      originalContents: newOriginalContents,
    })

    // TODO(azirbel): Probably relies on whether schema is valid too. Refactor out
    if (_.isEmpty(errorMessage)) {
      this.validateSchema(newJson, this.state.schema)
    }
  }

  updateSchema = (newOriginalSchema, newJson, errorMessage) => {
    this.setState({
      originalSchema: newOriginalSchema,
      schema: newJson,
      schemaErrorMessage: errorMessage,
    })

    // TODO(azirbel): Probably relies on whether contents is valid too. Refactor out
    if (_.isEmpty(errorMessage)) {
      this.validateSchema(this.state.contents, newJson)
    }
  }

  async validateSchema(json, schema) {
    Schema.validate({
      schema: JSON.stringify(schema),
      contents: JSON.stringify(json),
    }).then(({ data }) => {
      let { errors } = data
      this.setState({ serverErrors: errors })
    })
  }

  generateSchema = async () => {
    Schema.generate({
      contents: JSON.stringify(this.state.contents),
    }).then(({ data }) => {
      this.setState({
        schema: data.schema,
        originalSchema: data.originalSchema,
      })
      this.validateSchema(this.state.contents, data.schema)
    })
  }

  removeSchema = () => {
    this.setState({
      schema: null,
      originalSchema: '',
    })
  }

  saveNewTitle = newTitle => {
    this.setState({ isSavingTitle: true })

    return Document.update(this.props.params.documentToken, {
      title: newTitle,
    }).then(({ data }) => {
      this.onLoadDocument(data)
      this.setState({
        isSavingTitle: false,
      })
    })
  }

  saveDocument = (extraParams) => {
    let saveState = _.cloneDeep(this.state)

    return Document.update(this.props.params.documentToken, _.merge({
      contents: saveState.contents ? JSON.stringify(saveState.contents) : null,
      originalContents: saveState.originalContents,
      schema: saveState.schema ? JSON.stringify(saveState.schema) : null,
      originalSchema: saveState.originalSchema,
    }, extraParams)).then(({ data }) => {
      this.onLoadDocument(data)
      this.setState({
        savedOriginalContents: saveState.originalContents,
        savedOriginalSchema: saveState.originalSchema,
      })
    })
  }

  handleLockContents = () => {
    this.setState({ modalActionInProgress: true })

    this.saveDocument({ contentsLocked: true }).then(() => {
      this.setOpenModal(null)
      this.setState({ modalActionInProgress: false })
    })
  }

  handleLockSchema = () => {
    this.setState({ modalActionInProgress: true })

    this.saveDocument({ schemaLocked: true }).then(() => {
      this.setOpenModal(null)
      this.setState({ modalActionInProgress: false })
    })
  }

  setOpenModal = (openModalName) => {
    this.setState({ openModalName })
  }

  render() {
    let hasSaved =
      this.state.originalContents === this.state.savedOriginalContents &&
      this.state.originalSchema === this.state.savedOriginalSchema

    let titleEditable = this.state.document.editable
    let jsonEditable = titleEditable && !this.state.document.contentsLocked

    return (
      <div className="document-page">
        <LockContentsModal
          isLoading={this.state.modalActionInProgress}
          isOpen={this.state.openModalName === 'lockContents'}
          onClose={() => this.setOpenModal(null)}
          onLockContents={this.handleLockContents}
        />
        <LockSchemaModal
          isLoading={this.state.modalActionInProgress}
          isOpen={this.state.openModalName === 'lockSchema'}
          onClose={() => this.setOpenModal(null)}
          onLockSchema={this.handleLockSchema}
        />
        <ShareModal
          document={this.state.document}
          isOpen={this.state.openModalName === 'share'}
          onClose={() => this.setOpenModal(null)}
        />
        <Header fullWidth={true}>
          <ClickToEdit
            value={this.state.document.title || ''}
            readOnly={!this.state.document.editable}
            onChange={this.saveNewTitle}
            isLoading={this.state.isSavingTitle}
            textClassName="page-title"
            inputClassName="edit-title-input"
          />
          <div className="flex-spring" />
          {jsonEditable &&
            (hasSaved ? (
              <button disabled className="button cta disabled">
                Saved
              </button>
            ) : (
              <button className="button cta" onClick={() => this.saveDocument()}>
                Save
              </button>
            ))}
          <button className="button subtle" onClick={() => this.setOpenModal('share')}>
            Share
          </button>
        </Header>
        {this.state.isLoading ? (
          <PageLoadingPlaceholder />
        ) : (
          this.renderMain()
        )}
      </div>
    )
  }

  renderMain() {
    let titleEditable = this.state.document.editable
    let jsonEditable = titleEditable && !this.state.document.contentsLocked
    let schemaEditable = jsonEditable && !this.state.document.schemaLocked

    return (
      <div className="main-container">
        {!jsonEditable && (
          <div className="banner dark-gray">
            <div className="container flex align-center justify-center">
              <MdLock className="locked-icon" />
              {this.state.document.contentsLocked
                ? 'This document is locked, but you can make a copy.'
                : 'This document belongs to another user. Log in to make changes, or make a copy.'}
            </div>
          </div>
        )}
        <div className="main">
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <h5 className="data-header">JSON Data</h5>
              <ContentsEditor
                onAutoformatContents={this.autoformatContents}
                onChange={this.updateContents}
                onOpenLockModal={() => this.setOpenModal('lockContents')}
                originalContents={this.state.originalContents}
                readOnly={!jsonEditable}
              />
              <div className="text-right">
                {this.state.contentsErrorMessage}
              </div>
            </div>
            <div className="col-xs-12 col-sm-6">
              <h5 className="data-header">Schema</h5>
              {!_.isEmpty(this.state.originalSchema) ? (
                <div>
                  <SchemaEditor
                    document={this.state.document}
                    originalSchema={this.state.originalSchema}
                    onChange={this.updateSchema}
                    onRemoveSchema={this.removeSchema}
                    onAutoformatSchema={this.autoformatSchema}
                    onOpenLockModal={() => this.setOpenModal('lockSchema')}
                    readOnly={!schemaEditable}
                    jsonEditable={jsonEditable}
                  />
                  <div className="text-right">
                    {this.state.schemaErrorMessage}
                    {this.state.serverErrors.map((se, idx) => (
                      <p key={idx}>{se}</p>
                    ))}
                  </div>
                </div>
              ) : (
                schemaEditable && (
                  <SchemaPlaceholder
                    onGenerate={this.generateSchema}
                  />
                )
              )}
            </div>
          </div>
        </div>
        <div className="flex-spring" />
        <div className="section dark-white">
          <p className="text-center">
            This document is available at&nbsp;
            <a target="_blank" href={this.state.document.apiUrl}>
              {this.state.document.apiUrl}
            </a>
          </p>
        </div>
      </div>
    )
  }
}

export default connect()(DocumentPage)
