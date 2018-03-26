// @format

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { MdLock } from 'react-icons/lib/md'
import { CSSTransitionGroup } from 'react-transition-group'
import { Helmet } from 'react-helmet'
import _ from 'lodash'

import { IFRAME_SRC_DOC, evalParseObject } from '../helpers/sandboxedEval'
import Document from '../models/Document'
import PageLoadingPlaceholder from '../components/PageLoadingPlaceholder'
import Schema from '../models/Schema'

import ContentsEditor from './DocumentPage/ContentsEditor'
import DocumentPageHeader from './DocumentPage/DocumentPageHeader'
import LockContentsModal from './DocumentPage/LockContentsModal'
import LockSchemaModal from './DocumentPage/LockSchemaModal'
import SchemaEditor from './DocumentPage/SchemaEditor'
import ShareModal from './DocumentPage/ShareModal'

import {} from './DocumentPage.css'

class DocumentPage extends Component {
  state = {
    contents: null,
    contentsErrorMessage: '',
    document: {},
    isLoading: false,
    isSaving: false,
    lockdownContentsModalVisible: false,
    lockdownSchemaModalVisible: false,
    modalActionInProgress: false,
    openModalName: null,
    originalContents: '',
    originalSchema: '',
    savedOriginalContents: '',
    savedOriginalSchema: '',
    schema: null,
    schemaErrorMessage: '',
    serverErrors: [],
    showContentsErrorMessage: false,
    showSchemaErrorMessage: false,
    validationErrorMessage: '',
  }

  loadDocument(token) {
    this.setState({ isLoading: true })
    Document.get(token).then(({ data }) => this.onLoadDocument(data))
  }

  onLoadDocument = data => {
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

  validationsHandlerId = null

  componentDidMount() {
    this.loadDocument(this.props.params.documentToken)
    this.validationsHandlerId = setInterval(this.runValidations, 100)
  }

  componentWillUnmount() {
    // TODO(azirbel): Confirm that this stops running on client-side transitions
    clearInterval(this.validationsHandlerId)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.params.documentToken !== this.props.params.documentToken) {
      this.loadDocument(newProps.params.documentToken)
    }
  }

  // Ace editor is picky and gets upset when we try to kick off a validation job
  // during the content change handler. (Any tiny slowness causes lag and makes the cursor
  // get misplaced). So we run validations completely separately. I think this may still
  // cause the occasional race condition but is hopefully good enough
  sandboxedIframe = null
  lastValidatedSchema = null
  lastValidatedContents = null
  runValidations = () => {
    let contentsChanged =
      this.lastValidatedContents !== this.state.originalContents
    let schemaChanged = this.lastValidatedSchema !== this.state.originalSchema

    if (contentsChanged) {
      evalParseObject(this.state.originalContents, this.sandboxedIframe).then(
        ({ json, errorMessage }) => {
          this.setState({
            contents: json,
            contentsErrorMessage: errorMessage,
          })
          if (_.isEmpty(errorMessage)) {
            this.validateSchemaMatch()
            if (_.isEmpty(this.state.validationErrorMessage)) {
              this.setState({ showContentsErrorMessage: false })
            }
          }
        }
      )
      this.lastValidatedContents = this.state.originalContents
    }

    if (schemaChanged) {
      evalParseObject(this.state.originalSchema, this.sandboxedIframe).then(
        ({ json, errorMessage }) => {
          this.setState({
            schema: json,
            schemaErrorMessage: errorMessage,
          })
          if (_.isEmpty(errorMessage)) {
            this.setState({ showSchemaErrorMessage: false })
            this.validateSchemaMatch()
          }
        }
      )
      this.lastValidatedSchema = this.state.originalSchema
    }
  }

  handleContentsTypingBreakpoint = () => {
    if (this.state.contentsErrorMessage) {
      this.setState({ showContentsErrorMessage: true })
    }
  }

  handleSchemaTypingBreakpoint = () => {
    if (this.state.schemaErrorMessage) {
      this.setState({
        showSchemaErrorMessage: true,
      })
    }
  }

  validateSchemaMatch = () => {
    if (_.isEmpty(this.state.originalSchema)) {
      this.setState({ validationErrorMessage: null })
      return
    }

    Schema.validate({
      contents: JSON.stringify(this.state.contents),
      schema: JSON.stringify(this.state.schema),
    }).then(({ data }) => {
      if (data.isValid) {
        this.setState({
          validationErrorMessage: null,
        })

        // TODO(azirbel): I'm sure there can be simpler show logic
        if (_.isEmpty(this.state.contentsErrorMessage)) {
          this.setState({ showContentsErrorMessage: false })
        }
      } else {
        this.setState({
          showContentsErrorMessage: true,
          validationErrorMessage: data.errors[0],
        })
      }
    })
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

  updateContents = newOriginalContents => {
    this.setState({
      originalContents: newOriginalContents,
    })
  }

  updateSchema = newOriginalSchema => {
    this.setState({
      originalSchema: newOriginalSchema,
    })
  }

  async validateSchema(json, schema) {}

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

  saveDocument = extraParams => {
    let saveState = _.cloneDeep(this.state)
    this.setState({ isSaving: true })

    return Document.update(
      this.props.params.documentToken,
      _.merge(
        {
          contents: saveState.contents
            ? JSON.stringify(saveState.contents)
            : null,
          originalContents: saveState.originalContents,
          schema: saveState.schema ? JSON.stringify(saveState.schema) : null,
          originalSchema: saveState.originalSchema,
        },
        extraParams
      )
    ).then(({ data }) => {
      this.onLoadDocument(data)
      this.setState({
        isSaving: false,
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

  setOpenModal = openModalName => {
    this.setState({ openModalName })
  }

  // TODO(azirbel): Getters?
  titleEditable = () => this.state.document.editable
  contentsEditable = () =>
    this.titleEditable() && !this.state.document.contentsLocked
  schemaEditable = () =>
    this.contentsEditable() && !this.state.document.schemaLocked

  render() {
    let hasSaved =
      this.state.originalContents === this.state.savedOriginalContents &&
      this.state.originalSchema === this.state.savedOriginalSchema

    let overallErrorMessage =
      (this.state.contentsErrorMessage ? 'Syntax error in JSON data' : null) ||
      (this.state.schemaErrorMessage ? 'Syntax error in schema' : null) ||
      (this.state.validationErrorMessage
        ? 'JSON data does not match schema'
        : null)

    return (
      <div className="document-page">
        <iframe
          className="hidden-iframe"
          sandbox="allow-scripts"
          srcDoc={IFRAME_SRC_DOC}
          ref={el => (this.sandboxedIframe = el)}
          key={this.props.params.documentToken}
        />
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
        <DocumentPageHeader
          contentsEditable={this.contentsEditable()}
          document={this.state.document}
          errorMessage={overallErrorMessage}
          hasSaved={hasSaved}
          isSavingDocument={this.state.isSaving}
          onLoadDocument={this.onLoadDocument}
          onOpenShareModal={() => this.setOpenModal('share')}
          onSaveDocument={() => this.saveDocument()}
          title={this.state.document.title}
          titleEditable={this.titleEditable()}
        />
        {this.state.isLoading ? <PageLoadingPlaceholder /> : this.renderMain()}
      </div>
    )
  }

  renderMain() {
    return (
      <div className="main-container">
        <Helmet>
          <title>{this.state.document.title}</title>
        </Helmet>
        {!this.contentsEditable() && (
          <div className="banner dark-gray">
            <div className="container flex align-center justify-center">
              <MdLock className="locked-icon" />
              &nbsp;
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
              {this.renderContents()}
            </div>
            <CSSTransitionGroup
              component="div"
              className="col-xs-12 col-sm-6"
              transitionName="downfade"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={1}
            >
              {this.state.originalSchema && (
                <div key="schema">
                  <h5 className="data-header">Schema</h5>
                  {this.renderSchema()}
                </div>
              )}
            </CSSTransitionGroup>
          </div>
        </div>
        <div className="flex-spring" />
        <div className="section dark-white">
          <p className="medium text-center">
            This document is available at&nbsp;
            <a target="_blank" href={this.state.document.apiUrl}>
              {this.state.document.apiUrl}
            </a>
          </p>
        </div>
      </div>
    )
  }

  renderContents() {
    return (
      <div>
        <ContentsEditor
          errorMessage={
            this.state.contentsErrorMessage || this.state.validationErrorMessage
          }
          canGenerateSchema={!this.state.originalSchema}
          onAutoformatContents={this.autoformatContents}
          onChange={this.updateContents}
          onGenerateSchema={this.generateSchema}
          onOpenLockModal={() => this.setOpenModal('lockContents')}
          onTypingBreakpoint={this.handleContentsTypingBreakpoint}
          originalContents={this.state.originalContents}
          readOnly={!this.contentsEditable()}
          showErrorMessage={this.state.showContentsErrorMessage}
        />
      </div>
    )
  }

  renderSchema() {
    return (
      <div>
        <SchemaEditor
          contentsEditable={this.contentsEditable()}
          document={this.state.document}
          errorMessage={this.state.schemaErrorMessage}
          onAutoformatSchema={this.autoformatSchema}
          onChange={this.updateSchema}
          onOpenLockModal={() => this.setOpenModal('lockSchema')}
          onRemoveSchema={this.removeSchema}
          onTypingBreakpoint={this.handleSchemaTypingBreakpoint}
          originalSchema={this.state.originalSchema}
          readOnly={!this.schemaEditable()}
          showErrorMessage={this.state.showSchemaErrorMessage}
        />
      </div>
    )
  }
}

export default connect()(DocumentPage)
